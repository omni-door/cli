import fs from 'fs';
import path from 'path';
import * as mkcert from 'mkcert';
import {
  logWarn,
  logErr,
  LOGLEVEL,
  require_cwd,
  exec,
  output_file
} from '@omni-door/utils';
import { EWServer, KNServer } from '../servers';
import open from './open';
/* import types */
import type { Config } from 'http-proxy-middleware';
import type { EWServerParams } from '../servers';
import type { PROJECT_TYPE } from '@omni-door/utils';
import type { OmniRouter, DevServerType, PathParams, MiddleWareCallback } from '../../index.d';

// types-proxy
export type ProxyItem = { route: PathParams; config: Config; };
export type ProxyConfig = (ProxyItem | ProxyFn)[];
export type ProxyFn = (params: {
  ip: string;
  port: number;
  host?: string;
  logLevel: LOGLEVEL;
  middlewareConfig?: MiddlewareConfig;
}) => ProxyItem;

// types-middleware
export type MiddlewareItem = { route: PathParams; callback: MiddleWareCallback; };
export type MiddlewareConfig = (MiddlewareItem | MiddlewareFn)[];
export type MiddlewareFn = (params: {
  ip: string;
  port: number;
  host?: string;
  logLevel: LOGLEVEL;
  proxyConfig?: ProxyConfig;
}) => MiddlewareItem;

// types-server
type EWServerOptions = Pick<EWServerParams, 'webpackConfig' | 'devMiddlewareOptions'>
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
  logLevel?: LOGLEVEL;
  proxyConfig?: ProxyConfig;
  middlewareConfig?: MiddlewareConfig;
  serverType: DevServerType;
  projectType: PROJECT_TYPE;
  routes?: OmniRouter
} & EWServerOptions;

async function server ({
  p,
  host,
  https: httpsConfig,
  CA,
  serverType,
  projectType,
  devMiddlewareOptions = {},
  logLevel = 'error',
  webpackConfig,
  proxyConfig = [],
  middlewareConfig = [],
  routes
}: ServerOptions): Promise<void> {
  try {
    const CWD = process.cwd();
    const ip = require_cwd('ip');
    const ipAddress: string = ip.address();
    const serverHost = host || '0.0.0.0';
    const openHost = host || ipAddress || '0.0.0.0';
    let serverUrl = openHost + ':' + p;

    const ServerDevCli = {
      storybook: `${path.resolve(CWD, 'node_modules/.bin/start-storybook')} -p ${p} -h ${serverHost} --quiet`,
      docz: `${path.resolve(CWD, 'node_modules/.bin/docz')} dev -p ${p} --host ${serverHost}`,
      bisheng: `${path.resolve(CWD, 'node_modules/.bin/bisheng')} start`,
      styleguidist: `${path.resolve(CWD, 'node_modules/.bin/styleguidist')} server --port ${p} --host ${serverHost}`,
      dumi: `${path.resolve(CWD, 'node_modules/.bin/dumi')} dev --port ${p} --host ${serverHost}`,
      next: `${path.resolve(CWD, 'node_modules/.bin/next')} dev --port ${p} --hostname ${serverHost}`
    };
    const autoOpenServer = [
      'docz',
      'styleguidist',
      'dumi',
      'next'
    ];

    if (serverType === 'default') {
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

      const serverBasicOptions = {
        logLevel,
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
            routes,
            ...serverBasicOptions
          });
          break;
        case 'ssr-vue':
          logWarn('暂不支持 ssr-vue 项目!');
          break;
        case 'spa-react':
        case 'spa-vue':
        default:
          EWServer({
            webpackConfig,
            devMiddlewareOptions,
            ...serverBasicOptions
          });
      }
    } else {
      let delay = 0;
      switch (serverType) {
        case 'docz':
          delay = 12000;
          break;
        case 'next':
          delay = 3000;
          break;
        default:
          delay = 5000;
      }
      serverUrl = 'http://' + serverUrl;
      exec([ServerDevCli[serverType]]);
      if (~autoOpenServer.indexOf(serverType)) setTimeout(() => open(serverUrl), delay);  
    }

  } catch (err) {
    logErr(err);
    process.exit(1);
  }
}

export default server;