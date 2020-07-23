import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';
import * as mkcert from 'mkcert';
import { logInfo, logWarn, logErr, LOGLEVEL, require_cwd, exec, output_file } from '@omni-door/utils';
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
  https?: boolean | { key: string; cert: string; };
  CA?: {
    organization?: string;
    countryCode?: string;
    state?: string;
    locality?: string;
    validityDays?: number;
  };
  webpackConfig: Configuration;
  logLevel?: LOGLEVEL;
  devMiddlewareOptions?: Partial<Options>;
  proxyConfig?: (ProxyItem | ProxyFn)[];
  middlewareConfig?: (MiddlewareItem | MiddlewareFn)[];
  serverType: ServerType
};

async function server ({
  p,
  host,
  https: httpsConfig,
  CA,
  serverType,
  devMiddlewareOptions = {},
  logLevel = 'error',
  webpackConfig,
  proxyConfig = [],
  middlewareConfig = []
}: ServerOptions): Promise<void> {
  try {
    const CWD = process.cwd();
    const ip = require_cwd('ip');
    const ipAddress: string = ip.address();
    const serverHost = host || '0.0.0.0';
    const openHost = host || ipAddress || '0.0.0.0';
    let serverUrl = openHost + ':' + p;

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

      let isHttps = false;
      let key, cert;
      if (httpsConfig) {
        if (typeof httpsConfig === 'boolean') {
          try {
            const cacheDirPath = path.resolve(__dirname, '../../../.omni_cache');
            const keyPath = path.resolve(cacheDirPath, `${openHost}-key.pem`);
            const certPath = path.resolve(cacheDirPath, `${openHost}-cert.pem`);

            if (fs.existsSync(keyPath)) {
              key = fs.readFileSync(keyPath);
              cert = fs.readFileSync(certPath);
            } else {
              const ca = await mkcert.createCA({
                organization: 'OMNI-DOOR',
                countryCode: 'CN',
                state: 'SHANGHAI',
                locality: 'SONGJIANG',
                validityDays: 365,
                ...CA
              });
  
              const certificate = await mkcert.createCert({
                domains: [openHost, '127.0.0.1', 'localhost'],
                validityDays: 365,
                caKey: ca.key,
                caCert: ca.cert
              });
              key = certificate.key;
              cert = certificate.cert;
              output_file({
                file_path: keyPath,
                file_content: key
              });
              output_file({
                file_path: certPath,
                file_content: cert
              });
            }

            isHttps = true;
          } catch (err) {
            logWarn(err);
            logWarn(`生成证书失败！(Failing to generate the certificate!)\n
            可通过以下方式手动指定证书:
            https: {
              key: fs.readFileSync(path.resolve(\${your_path_to_key})),
              cert: fs.readFileSync(path.resolve(\${your_path_to_cert}))
            }`);
            isHttps = false;
          }
        } else {
          key = httpsConfig.key;
          cert = httpsConfig.cert;
        }
      }

      if (isHttps && (!key || !cert)) {
        logWarn('证书缺失，将以http启动开发服务！(Missing the certificate, start the dev-server with http!)');
        isHttps = false;
      }

      let server;
      if (isHttps) {
        server = https.createServer({
          key,
          cert
        }, app);
        serverUrl = 'https://' + serverUrl;
      } else {
        server = http.createServer(app);
        serverUrl = 'http://' + serverUrl;
      }

      server.listen(p, serverHost, async () => {
        await open(serverUrl);
        logInfo('> Ready on ip: ' + serverUrl);
      });
    } else {
      let delay = 5000;
      if (serverType === 'docz') delay = 12000;
      serverUrl = 'http://' + serverUrl;
      exec([ServerStartCli[serverType]]);
      if (~autoOpenServer.indexOf(serverType)) setTimeout(() => open(serverUrl), delay);  
    }

  } catch (err) {
    logErr(err);
    process.exit(1);
  }
}

export default server;