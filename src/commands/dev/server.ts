import path from 'path';
import { logInfo } from '../../utils/logger';
import { Configuration } from 'webpack';
import { Config } from 'http-proxy-middleware';

export type ServerOptions = {
  p: number;
  webpackConfig: Configuration;
  proxyConfig?: { route: string; config: Config; }[]
};

function server ({
  p,
  webpackConfig,
  proxyConfig = []
}: ServerOptions): void {
  const open = require('open');
  const ip = require('ip');
  const express = require('express');
  const proxy = require('http-proxy-middleware');
  const webpack = require('webpack');
  const devMiddleware = require('webpack-dev-middleware');
  const hotMiddleware = require('webpack-hot-middleware');

  const compiler = webpack(webpackConfig);
  const app = express();

  // dev server middleware
  app.use(devMiddleware(compiler, {
    publicPath: '/',
    logLevel: 'error'
  }));

  // hot refresh middleware
  app.use(hotMiddleware(compiler, {
    log: logInfo, 
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

  app.listen(p, () => {
    const url_local = 'http://localhost:' + p;
    const url_ip = 'http://' + ip.address() + ':' + p;
    open(url_ip);
    logInfo('> Ready on local: ' + url_local);
    logInfo('> Ready on ip: ' + url_ip);
  });
}

export default server;