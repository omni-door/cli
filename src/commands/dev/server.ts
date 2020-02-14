import path from 'path';
import { logInfo, logErr } from '../../utils/logger';
import { Express, Request, Response, NextFunction } from 'express';
import { PathParams } from 'express-serve-static-core';
import { Configuration, Compiler } from 'webpack';
import { Config } from 'http-proxy-middleware';
import { LogLevel } from '../../index.d';

export type ServerOptions = {
  p: number;
  logLevel?: LogLevel;
  webpackConfig: Configuration;
  proxyConfig?: { route: string; config: Config; }[];
  middlewareConfig?: { route: PathParams; callback: (req: Request, res: Response, next: NextFunction) => void; }[];
};

function server ({
  p,
  logLevel = 'error',
  webpackConfig,
  proxyConfig = [],
  middlewareConfig = []
}: ServerOptions): void {
  try {
    const open = require('open');
    const ip = require('ip');
    const express = require('express');
    const proxy = require('http-proxy-middleware');
    const webpack = require('webpack');
    const devMiddleware = require('webpack-dev-middleware');
    const hotMiddleware = require('webpack-hot-middleware');

    const compiler: Compiler = webpack(webpackConfig);
    const app: Express = express();

    // dev server middleware
    app.use(devMiddleware(compiler, {
      publicPath: '/',
      logLevel: logLevel
    }));

    // hot refresh middleware
    app.use(hotMiddleware(compiler, {
      log: logInfo, 
      path: '/__webpack_hmr', 
      heartbeat: 10 * 1000
    }));

    // http proxy middleware
    for (let i = 0; i < proxyConfig.length; i++) {
      const item = proxyConfig[i];
      app.use(
        item.route,
        proxy(item.config)
      );
    }

    // custom middleware
    for (let i = 0; i < middlewareConfig.length; i++) {
      const item = middlewareConfig[i];
      app.use(
        item.route,
        item.callback
      );
    }

    // index.html
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

    app.listen(p, () => {
      const url_local = 'http://localhost:' + p;
      const url_ip = 'http://' + ip.address() + ':' + p;
      open(url_ip);
      logInfo('> Ready on local: ' + url_local);
      logInfo('> Ready on ip: ' + url_ip);
    });
  } catch (err) {
    logErr(err);
  }
}

export default server;