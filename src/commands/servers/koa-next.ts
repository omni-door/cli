// !deprecated
import path from 'path';
import http from 'http';
import https from 'https';
import { logInfo, logWarn, logErr, requireCwd, _typeof } from '@omni-door/utils';
import open from '../dev/open';
/* import types */
import type NextServer from 'next-server/dist/server/next-server';
import type * as KoaRouter from 'koa-router';
import type { ProxyConfig, MiddlewareConfig, CorsConfig } from '../dev/server';
import type { NextRouter, KNMiddleWareCallback, KoaApp, ANY_OBJECT } from '../../index.d';

export interface KNServerParams {
  dev: boolean;
  proxyConfig?: ProxyConfig;
  middlewareConfig?: MiddlewareConfig;
  corsConfig?: CorsConfig;
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
  proxyConfig = [],
  middlewareConfig = [],
  corsConfig,
  host,
  listenHost,
  port,
  httpsConfig,
  nextRouter
}: KNServerParams) {
  const Koa = requireCwd('koa');
  const next = requireCwd('next');
  const Router = requireCwd('koa-router');
  const bodyParser = requireCwd('koa-bodyparser');
  const k2c = requireCwd('koa2-connect');
  const statics = requireCwd('koa-static');
  const cors = requireCwd('@koa/cors');
  const proxy = requireCwd('http-proxy-middleware');
  const { pathToRegexp } = requireCwd('path-to-regexp');
  const publicPath = path.resolve(process.cwd(), 'public');

  const nextApp: NextServer = next({ dev });
  nextApp
    .prepare()
    .then(() => {
      const app: KoaApp = new Koa();
      const router: KoaRouter = new Router();

      // cors
      app.use(cors(corsConfig));

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
            middlewareConfig
          }) : item;

          try {
            if (
              pathToRegexp(route).test(path) ||
              new RegExp(`^${route}`).test(path)
            ) {
              needProxy = true;
              await k2c(proxy(path, config))(ctx, next);
              break;
            }
          } catch (err) {
            logWarn(err as any);
            logWarn(`The http-proxy「${route}」match error occurred`);
            logWarn(`http-proxy「${route}」匹配异常`);
          }
        }

        if (!needProxy) {
          await next();
        } else {
          return;
        }
      });

      // middleware: custom
      const middlewares = [...middlewareConfig];
      for (let i = 0; i < middlewares.length; i++) {
        const item = middlewares[i];
        const { route, callback, method } = typeof item === 'function' ? item({
          ip: ipAddress,
          port,
          host,
          proxyConfig
        }) : item;
        const _method = (method?.toLowerCase() ?? 'get') as 'get' | 'post' | 'put' | 'del';
        const anyStr = '@#$%^#*(&^!~)::;;".._--';
        const wildcardRoute = !route || pathToRegexp(route).test(anyStr) || new RegExp(`^${route}`).test(anyStr);
        if (wildcardRoute) {
          router.use(<KNMiddleWareCallback>callback);
        } else {
          router[_method](route, <KNMiddleWareCallback>callback);
        }
      }

      // inject routes
      // based on next-url-prettifier
      // https://github.com/BDav24/next-url-prettifier
      nextRouter && nextRouter?.forEachPattern(({ page, pattern, defaultParams, beforeRender }) => router.get(pattern, async (ctx, next) => {
        let shouldRender: boolean | ANY_OBJECT = true;

        try {
          const { req, res, query, params } = ctx;

          if (typeof beforeRender === 'function') {
            try {
              shouldRender = await beforeRender(ctx, next);
            } catch (err) {
              logWarn(err as any);
              logWarn(`The ${page}'s beforeRender error!`);
              logWarn(`${page} 页面 beforeRender 执行异常`);
            }
          }

          shouldRender && nextApp.render(req, res, `/${page}`, Object.assign(Object.create(null), defaultParams, query, params, _typeof(shouldRender) === 'object' ? shouldRender : null));
        } catch (err) {
          shouldRender = false;
          logWarn(JSON.stringify(err));
          logWarn(`The ${page} router error`);
          logWarn(`${page} 路由出错`);
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
      app.use(router.routes()).use(router.allowedMethods());

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
