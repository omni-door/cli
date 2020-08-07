import { Configuration } from 'webpack';
export { Configuration } from 'webpack';
import { Config } from 'http-proxy-middleware';
export { Config } from 'http-proxy-middleware';
import { Options as DevMiddlewareOptions } from 'webpack-dev-middleware';
export { Options as DevMiddlewareOptions } from 'webpack-dev-middleware';
import { Request, Response, NextFunction } from 'express';
export { Request, Response, NextFunction } from 'express';
import * as KoaApp from 'koa';
import { BUILD, PROJECT_TYPE, STYLE, PLUGINSTAGE, LOGLEVEL, HASH } from '@omni-door/utils';

export type ANYOBJECT = { [propName: string]: any };

export type PathParams = string | RegExp | (string | RegExp)[];

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

export type DevServerType = 'next' | 'storybook' | 'docz' | 'dumi' | 'bisheng' | 'styleguidist' | 'default';
export type ProdServerType = 'next' | 'koa-next' | 'nuxt' | 'koa-nuxt';

export type OmniRouter = {
  page: string;
  prettyUrl: (params: ANYOBJECT) => string;
  prettyUrlPatterns: { pattern: PathParams; defaultParams?: ANYOBJECT }[];
  beforeRender?: (ctx: KoaApp.ParameterizedContext, next: KoaApp.Next) => boolean;
}[];

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
  logLevel?: LOGLEVEL;
  proxy?: {
    route: string;
    config: Config;
  }[];
  middleware?: {
    route: PathParams;
    callback: MiddleWareCallback;
  }[];
  serverType?: ProdServerType;
  routes?: OmniRouter;
};
export interface OmniConfig {
  type: PROJECT_TYPE;
  dev?: OmniServer & {
    devMiddlewareOptions?: Partial<DevMiddlewareOptions>;
    webpack?: Configuration;
    serverType?: DevServerType;
  };
  server?: OmniServer;
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
    npm?: string;
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
    readme?: [boolean, 'mdx' | 'md'];
  };
  plugins?: OmniPlugin<PLUGINSTAGE>[];
}