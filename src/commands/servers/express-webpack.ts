import path from 'path';
import http from 'http';
import https from 'https';
import { logInfo, require_cwd } from '@omni-door/utils';
import open from '../dev/open';
/* import types */
import type { Express } from 'express';
import type { Configuration, Compiler } from 'webpack';
import type { WebpackDevMiddleware, Options } from 'webpack-dev-middleware';
import type { NextHandleFunction } from 'connect';
import type { ProxyConfig, MiddlewareConfig } from '../dev/server';
import type { EWMiddleWareCallback } from '../../index.d';

export interface EWServerParams {
  webpackConfig: Configuration;
  devMiddlewareOptions?: Partial<Options>;
  proxyConfig?: ProxyConfig;
  middlewareConfig?: MiddlewareConfig;
  ipAddress: string;
  host: string;
  listenHost?: string;
  port: number;
  httpsConfig?: {
    key?: string | Buffer;
    cert?: string | Buffer;
  };
  favicon?: string;
}

export default function ({
  webpackConfig,
  devMiddlewareOptions,
  proxyConfig = [],
  middlewareConfig = [],
  ipAddress,
  host,
  listenHost,
  port,
  httpsConfig,
  favicon: faviconPath
}: EWServerParams) {
  const express = require_cwd('express');
  const favicon = require_cwd('serve-favicon');
  const proxy = require_cwd('http-proxy-middleware');
  const webpack = require_cwd('webpack');
  const compiler: Compiler = webpack(webpackConfig);
  const devMiddleware: WebpackDevMiddleware & NextHandleFunction = require_cwd('webpack-dev-middleware')(compiler, {
    publicPath: '/',
    ...devMiddlewareOptions
  });
  const hotMiddleware= require_cwd('webpack-hot-middleware');
 
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
      proxyConfig
    }) : item;

    app.use(
      route,
      callback as EWMiddleWareCallback
    );
  }

  // favicon.ico
  app.use(favicon(faviconPath || path.resolve(__dirname, 'favicon.ico')));

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

  server.listen(port, listenHost || host, async () => {
    await open(serverUrl);
    logInfo('> Ready on: ' + serverUrl);
  });
}