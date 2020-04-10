import path from 'path';
import { logInfo, logErr, LOGLEVEL, require_cwd } from '@omni-door/utils';
import { Express, Request, Response, NextFunction } from 'express';
import { PathParams } from 'express-serve-static-core';
import { Configuration, Compiler } from 'webpack';
import { Config } from 'http-proxy-middleware';
import { WebpackDevMiddleware } from 'webpack-dev-middleware';
import { NextHandleFunction } from 'connect';
import open from './open';

export type ServerOptions = {
  p: number;
  logLevel?: LOGLEVEL;
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
    const ip = require_cwd('ip');
    const express = require_cwd('express');
    const proxy = require_cwd('http-proxy-middleware');
    const webpack = require_cwd('webpack');
    const compiler: Compiler = webpack(webpackConfig);
    const devMiddleware: WebpackDevMiddleware & NextHandleFunction = require_cwd('webpack-dev-middleware')(compiler, {
      publicPath: '/',
      logLevel: logLevel
    });
    const hotMiddleware = require_cwd('webpack-hot-middleware');

    const app: Express = express();

    // dev server middleware
    app.use(devMiddleware);

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

    // index.html for SPA history router
    app.use('*', function (req, res, next) {
      const filename = path.join(compiler.outputPath, 'index.html');
      devMiddleware.fileSystem.readFile(filename, function (err, result) {
        if (err) {
          return next(err);
        }
        res.set('content-type', 'text/html');
        res.send(result);
        res.end();
      });
    });

    app.listen(p, async () => {
      const url_local = 'http://localhost:' + p;
      const url_ip = 'http://' + ip.address() + ':' + p;
      await open(url_ip);
      logInfo('> Ready on local: ' + url_local);
      logInfo('> Ready on ip: ' + url_ip);
    });
  } catch (err) {
    logErr(err);
    process.exit(1);
  }
}

export default server;