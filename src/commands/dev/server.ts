import path from'path';
import inquirer from 'inquirer';
import open from'open';
import ip from 'ip';
import detectPort from 'detect-port';
import express from 'express';
import proxy from 'http-proxy-middleware';
import webpack from 'webpack';
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';
import { logErr, logInfo } from '../../utils/logger';
import { getLogo } from '../../utils/log_prefix';

export default async function ({
  p,
  webpackConfig,
  proxyConfig = []
}: {
  p: number;
  webpackConfig: webpack.Configuration;
  proxyConfig?: { route: string; config: proxy.Config; }[]
}): Promise<void> {
  const _p = await detectPort(p).catch(err => {
    logErr(err);
    return process.exit(1);
  });
  
  if (p !== _p) {
    inquirer.prompt([
      {
        name: 'changePort',
        type: 'confirm',
        message: `${getLogo()} ${p} 端口被占用了，切换到 ${_p}? (Port ${p} is not available, Would you like to run on ${_p}?)`,
        default: true
      }
    ]).then(answer => {
      if (answer.changePort) {
        runApp(_p);
      } else {
        process.exit(0);
      }
    });
  } else {
    runApp(p);
  }

  function runApp (port: number) {
    const compiler = webpack(webpackConfig);
    const app = express();

    // dev server middleware
    app.use(devMiddleware(compiler, {
      publicPath: '/',
      logLevel: 'debug'
    }));

    // hot refresh middleware
    app.use(hotMiddleware(compiler, {
      log: console.info, 
      path: '/__webpack_hmr', 
      heartbeat: 10 * 1000
    }));

    // proxy
    for (let i = 0; i < proxyConfig.length; i++) {
      const item = proxyConfig[i];
      app.use(
        item.route,
        proxy(item.config)
      );
    }

    app.use('*', function (req, res, next) {
      const filename = path.join(compiler.outputPath, 'index.html');
      compiler.inputFileSystem.readFile(filename, function (err, result) {
        if (err) {
          return next(err);
        }
        res.set('content-type', 'text/html');
        res.send(result);
        res.end();
      });
    });

    app.listen(port, () => {
      const url_local = 'http://localhost:' + port;
      const url_ip = 'http://' + ip.address() + ':' + port;
      open(url_ip);
      logInfo('> Ready on local: ' + url_local);
      logInfo('> Ready on ip: ' + url_ip);
    });
  }
}