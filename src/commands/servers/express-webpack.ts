import path from 'path';
import http from 'http';
import https from 'https';
import { logInfo, require_cwd, LOGLEVEL } from '@omni-door/utils';
import { Express, Request, Response, NextFunction } from 'express';
import { Configuration, Compiler } from 'webpack';
import { WebpackDevMiddleware, Options } from 'webpack-dev-middleware';
import { NextHandleFunction } from 'connect';
import open from '../dev/open';
import { ProxyConfig, MiddlewareConfig } from '../dev/server';

export type EWMiddleWareCallback = (req: Request, res: Response, next: NextFunction) => void;
export interface EWServerParams {
  webpackConfig: Configuration;
  logLevel: LOGLEVEL;
  devMiddlewareOptions?: Partial<Options>;
  proxyConfig?: ProxyConfig;
  middlewareConfig?: MiddlewareConfig;
  ipAddress: string;
  host: string;
  port: number;
  httpsConfig?: {
    key?: string | Buffer;
    cert?: string | Buffer;
  };
}

export default function ({
  webpackConfig,
  logLevel,
  devMiddlewareOptions,
  proxyConfig = [],
  middlewareConfig = [],
  ipAddress,
  host,
  port,
  httpsConfig
}: EWServerParams) {
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
      port,
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
      port,
      host,
      logLevel,
      proxyConfig
    }) : item;

    app.use(
      route,
      callback as EWMiddleWareCallback
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

  let server;
  let serverUrl = `${host}:${port}`;
  if (httpsConfig) {
    server = https.createServer({
      key: httpsConfig.key,
      cert: httpsConfig.cert
    }, app);
    serverUrl = 'https://' + serverUrl;
  } else {
    server = http.createServer(app);
    serverUrl = 'http://' + serverUrl;
  }

  server.listen(port, host, async () => {
    await open(serverUrl);
    logInfo('> Ready on: ' + serverUrl);
  });
}