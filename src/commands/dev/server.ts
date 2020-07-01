import path from 'path';
import { logInfo, logErr, LOGLEVEL, require_cwd, exec } from '@omni-door/utils';
import { Express, Request, Response, NextFunction } from 'express';
import { PathParams } from 'express-serve-static-core';
import { Configuration, Compiler } from 'webpack';
import { Config } from 'http-proxy-middleware';
import { WebpackDevMiddleware, Options } from 'webpack-dev-middleware';
import { NextHandleFunction } from 'connect';
import open from './open';
import { ServerType } from '../../index.d';

export type ProxyItem = { route: string; config: Config; };
export type  MiddlewareItem = { route: PathParams; callback: (req: Request, res: Response, next: NextFunction) => void; };

export type ProxyFn = (params: {
  ip: string;
  port: number;
  host?: string;
  logLevel: LOGLEVEL;
  middlewareConfig?: (MiddlewareItem | MiddlewareFn)[];
}) => ProxyItem;

export type MiddlewareFn = (params: {
  ip: string;
  port: number;
  host?: string;
  logLevel: LOGLEVEL;
  proxyConfig?: (ProxyItem | ProxyFn)[];
}) => MiddlewareItem;

export type ServerOptions = {
  p: number;
  host?: string;
  webpackConfig: Configuration;
  logLevel?: LOGLEVEL;
  devMiddlewareOptions?: Partial<Options>;
  proxyConfig?: (ProxyItem | ProxyFn)[];
  middlewareConfig?: (MiddlewareItem | MiddlewareFn)[];
  serverType: ServerType
};

function server ({
  p,
  host,
  serverType,
  devMiddlewareOptions = {},
  logLevel = 'error',
  webpackConfig,
  proxyConfig = [],
  middlewareConfig = []
}: ServerOptions): void {
  try {
    const CWD = process.cwd();
    const ip = require_cwd('ip');
    const ipAddress: string = ip.address();
    const serverHost = host || ipAddress || 'localhost';
    const serverUrl = 'http://' + serverHost + ':' + p;

    const ServerStartCli = {
      storybook: `${path.resolve(CWD, 'node_modules/.bin/start-storybook')} -p ${p} -h ${serverHost} --quiet`,
      docz: `${path.resolve(CWD, 'node_modules/.bin/docz')} dev -p ${p} --host ${serverHost}`,
      bisheng: `${path.resolve(CWD, 'node_modules/.bin/bisheng')} start`,
      styleguidist: `${path.resolve(CWD, 'node_modules/.bin/styleguidist')} server --port ${p} --host ${serverHost}`,
      dumi: `${path.resolve(CWD, 'node_modules/.bin/dumi')} dev --port ${p} --host ${serverHost}`
    };
    const autoOpenServer = [
      'docz',
      'styleguidist',
      'dumi'
    ];

    if (serverType === 'default') {
      const express = require_cwd('express');
      const proxy = require_cwd('http-proxy-middleware');
      const webpack = require_cwd('webpack');
      const compiler: Compiler = webpack(webpackConfig);
      const devMiddleware: WebpackDevMiddleware & NextHandleFunction = require_cwd('webpack-dev-middleware')(compiler, {
        publicPath: '/',
        logLevel,
        ...devMiddlewareOptions
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
        const { route, config } = typeof item === 'function' ? item({
          ip: ipAddress,
          port: p,
          host,
          logLevel,
          middlewareConfig
        }) : item;

        app.use(
          route,
          proxy(config)
        );
      }

      // custom middleware
      for (let i = 0; i < middlewareConfig.length; i++) {
        const item = middlewareConfig[i];
        const { route, callback } = typeof item === 'function' ? item({
          ip: ipAddress,
          port: p,
          host,
          logLevel,
          proxyConfig
        }) : item;

        app.use(
          route,
          callback
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

      app.listen(p, serverHost, async () => {
        await open(serverUrl);
        logInfo('> Ready on ip: ' + serverUrl);
      });
    } else {
      exec([ServerStartCli[serverType]]);
      if (~autoOpenServer.indexOf(serverType)) setTimeout(() => open(serverUrl), 8000);  
    }

  } catch (err) {
    logErr(err);
    process.exit(1);
  }
}

export default server;