import http from 'http';
import https from 'https';
import { logInfo, require_cwd, LOGLEVEL } from '@omni-door/utils';
import * as KoaApp from 'koa';
import * as KoaRouter from 'koa-router';
import NextServer from 'next-server/dist/server/next-server';
import open from '../dev/open';
import { ProxyConfig, MiddlewareConfig } from '../dev/server';

export type KNMiddleWareCallback = KoaApp.Middleware;
export interface KNServerParams {
  dev: boolean;
  logLevel: LOGLEVEL;
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
  dev,
  ipAddress,
  logLevel,
  proxyConfig = [],
  middlewareConfig = [],
  host,
  port,
  httpsConfig
}: KNServerParams) {
  const Koa = require_cwd('koa');
  const next = require_cwd('next');
  const Router = require_cwd('koa-router');
  const bodyParser = require_cwd('koa-bodyparser');
  const k2c = require_cwd('koa2-connect');
  const proxy = require_cwd('http-proxy-middleware');
  const pathToRegexp = require_cwd('path-to-regexp');

  const nextApp: NextServer = next({ dev });
  nextApp
    .prepare()
    .then(() => {
      const app: KoaApp = new Koa();
      const router: KoaRouter = new Router();

      // middleware: http-proxy
      app.use(async (ctx, next) => {
        const { path } = ctx;
        let needProxy = false;

        for (let i = 0; i < proxyConfig.length; i++) {
          const item = proxyConfig[i];
          const { route, config } = typeof item === 'function' ? item({
            ip: ipAddress,
            port,
            host,
            logLevel,
            middlewareConfig
          }) : item;
  
          if (
            pathToRegexp(route).test(path) ||
            new RegExp(`^${route}`).test(path)
          ) {
            needProxy = true;
            await k2c(proxy(path, config))(ctx, next);
            break;
          }
        }

        if (!needProxy) {
          await next();
        } else {
          return;
        }
      });

      // middleware: custom
      for (let i = 0; i < middlewareConfig.length; i++) {
        const item = middlewareConfig[i];
        const { route, callback } = typeof item === 'function' ? item({
          ip: ipAddress,
          port,
          host,
          logLevel,
          proxyConfig
        }) : item;
    
        router.use(
          route as any,
          callback as KNMiddleWareCallback
        );
      }

      // other source redirect to '/'
      router.get('*', async ctx => {
        await nextApp.render(ctx.req, ctx.res, '/', ctx.query);
        ctx.status = 200;
        ctx.respond = false;
      });

      // middleware: body-parser and router
      app.use(bodyParser());
      app.use(router.routes());

      let server;
      let serverUrl = `${host}:${port}`;
      if (httpsConfig) {
        server = https.createServer({
          key: httpsConfig.key,
          cert: httpsConfig.cert
        }, app.callback());
        serverUrl = 'https://' + serverUrl;
      } else {
        server = http.createServer(app.callback());
        serverUrl = 'http://' + serverUrl;
      }

      server.listen(port, host, async () => {
        dev && await open(serverUrl);
        logInfo(`The server running with ${dev ? 'dev' : 'prod'}-mode!`);
        logInfo('> Ready on: ' + serverUrl);
      });
    });
}