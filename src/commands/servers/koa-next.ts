import path from 'path';
import http from 'http';
import https from 'https';
import { logInfo, logWarn, logErr, require_cwd, _typeof } from '@omni-door/utils';
import open from '../dev/open';
/* import types */
import type NextServer from 'next-server/dist/server/next-server';
import type * as KoaRouter from 'koa-router';
import type { LOGLEVEL } from '@omni-door/utils';
import type { ProxyConfig, MiddlewareConfig } from '../dev/server';
import type { NextRouter, KNMiddleWareCallback, KoaApp, ANYOBJECT } from '../../index.d';

export interface KNServerParams {
  dev: boolean;
  logLevel: LOGLEVEL;
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
  nextRouter?: NextRouter;
}

export default function ({
  dev,
  ipAddress,
  logLevel,
  proxyConfig = [],
  middlewareConfig = [],
  host,
  listenHost,
  port,
  httpsConfig,
  nextRouter
}: KNServerParams) {
  const Koa = require_cwd('koa');
  const next = require_cwd('next');
  const Router = require_cwd('koa-router');
  const bodyParser = require_cwd('koa-bodyparser');
  const k2c = require_cwd('koa2-connect');
  const statics = require('koa-static');
  const proxy = require_cwd('http-proxy-middleware');
  const { pathToRegexp } = require_cwd('path-to-regexp');
  const publicPath = path.resolve(process.cwd(), 'public');

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
            try {
              await k2c(proxy(path, config))(ctx, next);
            } catch (err) {
              logWarn(`http-proxy「${route}」匹配异常！(The http-proxy「${route})」match occur error!):\n ${err}`);
            }
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
      app.use(async (ctx, next) => {
        const { path } = ctx;
        let isMatch = false;

        for (let i = 0; i < middlewareConfig.length; i++) {
          const item = middlewareConfig[i];
          const { route, callback } = typeof item === 'function' ? item({
            ip: ipAddress,
            port,
            host,
            logLevel,
            proxyConfig
          }) : item;
      
          if (
            pathToRegexp(route).test(path) ||
            new RegExp(`^${route}`).test(path)
          ) {
            isMatch = true;
            try {
              await (<KNMiddleWareCallback>callback)(ctx, next);
            } catch (err) {
              logWarn(`中间件「${route}」匹配异常！(The middleware「${route})」match occur error!):\n ${err}`);
            }
            break;
          }
        }

        if (!isMatch) {
          await next();
        } else {
          return;
        }
      });

      // inject routes
      // based on next-url-prettifier
      // https://github.com/BDav24/next-url-prettifier
      nextRouter && nextRouter?.forEachPattern(({ page, pattern, defaultParams, beforeRender }) => router.get(pattern, async (ctx, next) => {
        let shouldRender: boolean | ANYOBJECT = true;

        try {
          const { req, res, query, params } = ctx;

          if (typeof beforeRender === 'function') {
            try {
              shouldRender = await beforeRender(ctx, next);
            } catch (err) {
              logWarn(`「${page}」页面 beforeRender 异常！(The「${page})」beforeRender error!):\n ${err}`);
            }
          }

          shouldRender && nextApp.render(req, res, `/${page}`, Object.assign(Object.create(null), defaultParams, query, params, _typeof(shouldRender) === 'object' ? shouldRender : null));
        } catch (err) {
          shouldRender = false;
          logWarn(`页面「${page}」路由出错：${JSON.stringify(err)}`);
        }

        if (shouldRender) {
          ctx.status = 200;
          ctx.respond = false;
        }
      }));

      // other source redirect to '/'
      router.get('(.*)', async ctx => {
        await nextApp.render(ctx.req, ctx.res, '/', ctx.query);
        ctx.status = 200;
        ctx.respond = false;
      });

      // middleware: static-server, body-parser and router
      app.use(statics(publicPath));
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

      server.listen(port, listenHost || host, async () => {
        dev && await open(serverUrl);
        logInfo(`The server running with ${dev ? 'DEV' : 'PROD'}-MODE!`);
        logInfo('> Ready on: ' + serverUrl);
      });
    })
    .catch(err => {
      const error = new Error(err);
      logErr(`${error}\nThe Error stack: ${error.stack}`);
    });
}