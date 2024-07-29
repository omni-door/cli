import fs from 'fs';
import path from 'path';
import * as mkcert from 'mkcert';
import {
  logWarn,
  logErr,
  requireCwd,
  exec,
  outputFile
} from '@omni-door/utils';
import { EWServer, KNServer } from '../servers';
import open from './open';
/* import types */
import type { Config } from 'http-proxy-middleware';
import type { EWServerParams } from '../servers';
import type { PROJECT_TYPE } from '@omni-door/utils';
import type { KoaApp, NextRouter, ServerType, PathParams, MiddleWareCallback, Method } from '../../index.d';

export type KoaCtx = KoaApp.ParameterizedContext<KoaApp.DefaultState, KoaApp.DefaultContext>;

// types-proxy
export type ProxyItem = { route: PathParams; config: Config; };
export type ProxyConfig = (ProxyItem | ProxyFn)[];
export type ProxyFn = (params: {
  ip: string;
  port: number;
  host?: string;
  middlewareConfig?: MiddlewareConfig;
}) => ProxyItem;

// types-middleware
export type MiddlewareItem = { route: PathParams; callback: MiddleWareCallback; method?: Method };
export type MiddlewareConfig = (MiddlewareItem | MiddlewareFn)[];
export type MiddlewareFn = (params: {
  ip: string;
  port: number;
  host?: string;
  proxyConfig?: ProxyConfig;
}) => MiddlewareItem;

// types-cors
export type CorsConfig = {
  origin?: string | ((ctx: KoaCtx) => string);
  allowMethods?: string | string[];
  exposeHeaders?: string | string[];
  allowHeaders?: string | string[];
  maxAge?: string | number;
  credentials?: boolean | ((ctx: KoaCtx) => string);
  keepHeadersOnError?: boolean;
  secureContext?: boolean;
  privateNetworkAccess?: boolean;
}

// types-server
type EWServerOptions = Pick<EWServerParams, 'webpackConfig' | 'devMiddlewareOptions' | 'favicon'>
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
  proxyConfig?: ProxyConfig;
  middlewareConfig?: MiddlewareConfig;
  corsConfig?: CorsConfig;
  serverType: ServerType;
  projectType: PROJECT_TYPE;
  nextRouter?: NextRouter;
} & EWServerOptions;

async function server ({
  p,
  host,
  https: httpsConfig,
  CA,
  serverType,
  projectType,
  devMiddlewareOptions = {},
  webpackConfig,
  proxyConfig = [],
  middlewareConfig = [],
  nextRouter,
  corsConfig,
  favicon
}: ServerOptions): Promise<void> {
  try {
    const CWD = process.cwd();
    const ip = requireCwd('ip');
    const ipAddress: string = ip.address();
    const serverHost = host || '0.0.0.0';
    const openHost = host || ipAddress || '0.0.0.0';
    let serverUrl = openHost + ':' + p;

    const ServerDevCli = {
      storybook: `${path.resolve(CWD, 'node_modules/.bin/storybook')} dev -p ${p} -h ${serverHost} --disable-telemetry --quiet --ci`,
      docz: `${path.resolve(CWD, 'node_modules/.bin/docz')} dev -p ${p} --host ${serverHost}`,
      bisheng: `${path.resolve(CWD, 'node_modules/.bin/bisheng')} start`,
      styleguidist: `${path.resolve(CWD, 'node_modules/.bin/styleguidist')} server --port ${p} --host ${serverHost}`,
      dumi: `${path.resolve(CWD, 'node_modules/.bin/dumi')} dev --port ${p} --host ${serverHost}`,
      next: `${path.resolve(CWD, 'node_modules/.bin/next')} dev --port ${p} --hostname ${serverHost}`,
      nuxt: `${path.resolve(CWD, 'node_modules/.bin/nuxt')} dev --port ${p} --hostname ${serverHost}`
    };
    const autoOpenServer = [
      'storybook',
      'docz',
      'styleguidist',
      'dumi',
      'next'
    ];

    const needCustomServer = !serverType || serverType === 'default' || serverType === 'express-webpack' || serverType === 'koa-next' || serverType === 'koa-nuxt';
    if (needCustomServer) {
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
              outputFile({
                file_path: keyPath,
                file_content: key
              });
              outputFile({
                file_path: certPath,
                file_content: cert
              });
            }

            isHttps = true;
          } catch (err) {
            logWarn(err as string);
            logWarn(`Failing to generate the certificate (生成证书失败)!\nYou can specify the certificate manually (可通过以下方式手动指定证书):

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
        logWarn('Missing the certificate, start the dev-server with http');
        logWarn('证书缺失，将以http启动开发服务');
        isHttps = false;
      }

      const serverBasicOptions = {
        middlewareConfig,
        proxyConfig,
        ipAddress,
        host: openHost,
        listenHost: serverHost,
        port: p,
        httpsConfig: isHttps ? { key, cert } : void 0
      };

      switch (projectType) {
        case 'ssr-react':
          KNServer({
            dev: process.env.NODE_ENV === 'production' ? false : true,
            nextRouter,
            corsConfig,
            ...serverBasicOptions
          });
          break;
        case 'ssr-vue':
          logWarn('Not support ssr-vue yet'); 
          logWarn('暂不支持 ssr-vue 项目'); 
          break;
        case 'spa-react':
        case 'spa-react-pc':
        case 'spa-vue':
          EWServer({
            webpackConfig,
            devMiddlewareOptions,
            favicon,
            ...serverBasicOptions
          });
          break;
      }
    } else {
      serverUrl = 'http://' + serverUrl;
      exec([ServerDevCli[serverType as keyof typeof ServerDevCli]]);
      if (~autoOpenServer.indexOf(serverType)) {
        const detectPort = requireCwd('detect-port');
        const openAfterPortAvailable = () => {
          setTimeout(() => {
            detectPort(p)
              .then((_p : number) => {
                if (_p === p) {
                  openAfterPortAvailable();
                } else {
                  open(serverUrl);
                }
              })
              .catch((err: any) => {
                logWarn(err);
                open(serverUrl);
              });
          }, 1000);
        };
        openAfterPortAvailable();
      } 
    }

  } catch (err) {
    logErr(err as string);
    process.exit(1);
  }
}

export default server;