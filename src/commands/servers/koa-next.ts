import http from 'http';
import https from 'https';
import { logInfo, logWarn, logErr, require_cwd, _typeof, LOGLEVEL } from '@omni-door/utils';
import * as KoaApp from 'koa';
import * as KoaRouter from 'koa-router';
import NextServer from 'next-server/dist/server/next-server';
import open from '../dev/open';
import { ProxyConfig, MiddlewareConfig } from '../dev/server';
import { OmniRouter, ANYOBJECT, KNMiddleWareCallback } from '../../index.d';

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
  routes?: OmniRouter;
}

export default function ({
  dev,
  ipAddress,
  logLevel,
  proxyConfig = [],
  middlewareConfig = [],
  host,
  port,
  httpsConfig,
  routes = []
}: KNServerParams) {
  const Koa = require_cwd('koa');
  const next = require_cwd('next');
  const Router = require_cwd('koa-router');
  const bodyParser = require_cwd('koa-bodyparser');
  const k2c = require_cwd('koa2-connect');
  const proxy = require_cwd('http-proxy-middleware');
  const { pathToRegexp } = require_cwd('path-to-regexp');
  const UrlPrettifier = require_cwd('next-url-prettifier').default;

  class NextUrlRouter extends UrlPrettifier {
    constructor (routes: OmniRouter, options: { root?: string; } = {}) {
      super(routes, options);
      this.root = options.root || '';
      this.linkPage = this.linkPage.bind(this);
      this.forEachPattern = this.forEachPattern.bind(this);
    }
  
    linkPage (pageName: string, params: { [param: string]: string; }) {
      const route = this.routes.find((currentRoute: OmniRouter[0]) => currentRoute.page === pageName);
  
      const obj = {
        as: '',
        href: `/${pageName}${this.paramsToQueryString(params)}`
      };
  
      if (route && route.prettyUrl) {
        obj.as = this.root + (typeof route.prettyUrl === 'string' ? route.prettyUrl : route.prettyUrl(params));
      }
  
      return obj;
    }
  
    forEachPattern (apply: (params: Pick<OmniRouter[0], 'page' | 'beforeRender'> & { pattern: string; defaultParams: ANYOBJECT; }) => any) {
      this.routes.forEach((route: OmniRouter[0]) => {
        this.getPrettyUrlPatterns(route).forEach((pattern: any) =>
          apply({
            page: route.page,
            beforeRender: route.beforeRender,
            pattern: this.root + pattern.pattern,
            defaultParams: pattern.defaultParams
          })
        );
      });
    }
  }

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

      // inject routes
      new NextUrlRouter(routes).forEachPattern(({ page, pattern, defaultParams, beforeRender }) => router.get(pattern, async (ctx, next) => {
        let shouldRender = true;

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
          logWarn(`页面 ${page} 路由出错：${JSON.stringify(err)}`);
        }

        if (shouldRender) {
          ctx.status = 200;
          ctx.respond = false;
        }
      }));

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
      router.get('(.*)', async ctx => {
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
        logInfo(`The server running with ${dev ? 'DEV' : 'PROD'}-MODE!`);
        logInfo('> Ready on: ' + serverUrl);
      });
    })
    .catch(err => {
      const error = new Error(err);
      logErr(`${error}\nThe Error stack: ${error.stack}`);
    });
}