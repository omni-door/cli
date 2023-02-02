import type { Configuration } from 'webpack';
export type { Configuration } from 'webpack';
import type { Config } from 'http-proxy-middleware';
export type { Config } from 'http-proxy-middleware';
import type { Options as DevMiddlewareOptions } from 'webpack-dev-middleware';
export type { Options as DevMiddlewareOptions } from 'webpack-dev-middleware';
import type { Request, Response, NextFunction } from 'express';
export type { Request, Response, NextFunction } from 'express';
import type * as KoaApp from 'koa';
export type { default as KoaApp } from 'koa';
import type { BUILD, PROJECT_TYPE, STYLE, PLUGINSTAGE, HASH, SPASERVER, COMPONENTSERVER, SSRSERVER, MARKDOWN } from '@omni-door/utils';

export type ANYOBJECT = { [propName: string]: any };

export type Method = 'get' | 'GET' | 'post' | 'POST' | 'put' | 'PUT' | 'del' | 'DEL';

export type PathParams = string | RegExp | (string | RegExp)[];

export type KoaCtx = KoaApp.ParameterizedContext<KoaApp.DefaultState, KoaApp.DefaultContext>;

export type OptionTemplate = {
  componentName: string;
  componentType: 'function' | 'class';
  tplSource: string;
};

export type OptionBuild = {
  verify?: boolean;
  buildConfig?: string;
};

export type OptionRelease = {
  version: string;
  versionIterTactic: 'ignore' | 'manual' | 'auto';
  verify?: boolean;
  tag?: string;
};

export interface PluginHandler<T extends PLUGINSTAGE> {
  (
    config: Omit<OmniConfig, 'dev' | 'plugins'>,
    options?: T extends 'new' ? OptionTemplate : T extends 'build' ? OptionBuild : OptionRelease
  ): Promise<any>;
} 
export type HandlerFactory = <T extends PLUGINSTAGE>(handler: PluginHandler<T>, errMsg?: string) => PluginHandler<T>;

export interface OmniPlugin<T extends PLUGINSTAGE> {
  name: string;
  stage: T;
  handler: PluginHandler<T>;
}

export type EWMiddleWareCallback = (req: Request, res: Response, next: NextFunction) => void;
export type KNMiddleWareCallback = KoaApp.Middleware;
export type MiddleWareCallback = EWMiddleWareCallback | KNMiddleWareCallback;

export type ServerType = SPASERVER | COMPONENTSERVER | SSRSERVER | 'default';

export interface NextRouter {
  forEachPattern: (apply: (params: {
    page: string;
    pattern: string;
    defaultParams?: ANYOBJECT;
    beforeRender?: (ctx: KoaApp.ParameterizedContext, next: KoaApp.Next) => boolean | ANYOBJECT;
  }) => any) => void;
}

export type OmniServer = {
  port?: number;
  host?: string;
  https?: boolean | { key: string; cert: string; };
  CA?: {
    organization?: string;
    countryCode?: string;
    state?: string;
    locality?: string;
    validityDays?: number;
  };
  proxy?: {
    route: PathParams;
    config: Config;
  }[];
  middleware?: {
    route: PathParams;
    callback: MiddleWareCallback;
    method?: Method;
  }[];
  cors?: {
    origin?: string | ((ctx: KoaCtx) => string);
    allowMethods?: string | string[];
    exposeHeaders?: string | string[];
    allowHeaders?: string | string[];
    maxAge?: string | number;
    credentials?: boolean | ((ctx: KoaCtx) => string);
    keepHeadersOnError?: boolean;
    secureContext?: boolean;
    privateNetworkAccess?: boolean;
  };
  nextRouter?: NextRouter;
};
export interface OmniConfig {
  type: PROJECT_TYPE;
  dev?: OmniServer & {
    devMiddlewareOptions?: Partial<DevMiddlewareOptions>;
    webpack?: Configuration;
    serverType?: ServerType;
    favicon?: string;
  };
  server?: OmniServer & { serverType?: SSRSERVER; };
  build: {
    autoRelease?: boolean;
    srcDir: string;
    outDir: string;
    esmDir?: string;
    hash?: boolean | HASH;
    configuration?: (config: ANYOBJECT) => ANYOBJECT;
    tool?: BUILD;
    preflight?: {
      typescript?: boolean;
      test?: boolean;
      eslint?: boolean;
      prettier?: boolean;
      stylelint?: boolean;
    };
    reserve?: {
      style?: boolean;
      assets?: (string | { srcPath: string; relativePath?: string; })[];
    };
  };
  release: {
    git?: string;
    npm?: string | boolean;
    autoBuild?: boolean;
    autoTag?: boolean;
    preflight?: {
      test?: boolean;
      eslint?: boolean;
      prettier?: boolean;
      stylelint?: boolean;
      commitlint?: boolean;
      branch?: string;
    };
  };
  template: {
    root: string;
    test?: boolean;
    typescript?: boolean;
    stylesheet?: STYLE;
    readme?: MARKDOWN | boolean;
  };
  plugins?: OmniPlugin<PLUGINSTAGE>[];
}