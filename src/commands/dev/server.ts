import path from'path';
import inquirer from 'inquirer';
import { logErr, logInfo } from '../../utils/logger';
import { getLogo } from '../../utils/log_prefix';
import { Configuration } from 'webpack';
import { Config } from 'http-proxy-middleware';

export default async function ({
  p,
  webpackConfig,
  proxyConfig = []
}: {
  p: number;
  webpackConfig: Configuration;
  proxyConfig?: { route: string; config: Config; }[]
}): Promise<void> {
  const open = require('open');
  const ip = require('ip');
  const detectPort = require('detect-port');
  const express = require('express');
  const proxy = require('http-proxy-middleware');
  const webpack = require('webpack');
  const devMiddleware = require('webpack-dev-middleware');
  const hotMiddleware = require('webpack-hot-middleware');

  const _p = await detectPort(p).catch((err: any) => {
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

    app.use('*', function (req: any, res: any, next: any) {
      const filename = path.join(compiler.outputPath, 'index.html');
      compiler.inputFileSystem.readFile(filename, function (err: any, result: any) {
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