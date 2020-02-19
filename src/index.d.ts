import { Configuration } from 'webpack';
export { Configuration } from 'webpack';
import { Config } from 'http-proxy-middleware';
export { Config } from 'http-proxy-middleware';
import { Request, Response, NextFunction } from 'express';
export { Request, Response, NextFunction } from 'express';
import { PathParams } from 'express-serve-static-core';
export { PathParams } from 'express-serve-static-core';
import { TPLS_ALL, TPLS_INITIAL, TPLS_INITIAL_FN, TPLS_INITIAL_RETURE, TPLS_NEW, TPLS_NEW_FN, TPLS_NEW_RETURE } from './templates';
export { TPLS_ALL, TPLS_INITIAL, TPLS_INITIAL_FN, TPLS_INITIAL_RETURE, TPLS_NEW, TPLS_NEW_FN, TPLS_NEW_RETURE } from './templates';
export type BUILD = 'webpack' | 'rollup' | 'tsc' | '';
export type NPM = 'npm' | 'yarn' | 'cnpm' | 'taobao';
export type PROJECT_TYPE = 'spa-react' | 'component-library-react' | 'toolkit';
export type TESTFRAME = 'mocha' | 'jest' | '';
export type PKJTOOL = 'yarn' | 'npm' | 'cnpm';
export type STYLE = 'less' | 'scss' | 'css' | 'all' | '';
export type DEVSERVER = 'basic' | 'docz' | 'storybook' | 'bisheng' | '';
export type STRATEGY = 'stable' | 'latest';
export type ANYOBJECT = { [propName: string]: any };
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

export type GenerateOmniConfigParams = {
  project_type: PROJECT_TYPE;
  build: BUILD;
  ts: boolean;
  test: boolean;
  testFrame?: TESTFRAME;
  style: STYLE;
  stylelint: boolean;
  eslint: boolean;
  commitlint: boolean;
  git?: string;
  npm: NPM | string;
  mdx: boolean;
};

export type PluginStage = 'new' | 'build' | 'release';

export interface PluginHandler {
  (config: Omit<OmniConfig, 'plugins'>): Promise<any>;
  (config: Omit<OmniConfig, 'plugins'>, tpls: TPLS_NEW): Promise<TPLS_NEW_RETURE>;
}

export type PluginHandler_Build = (config: Omit<OmniConfig, 'plugins'>) => Promise<any>;

export type PluginHandler_Release = (config: Omit<OmniConfig, 'plugins'>) => Promise<any>;

export type PluginHandler_New = (config: Omit<OmniConfig, 'plugins'>, tpls: TPLS_NEW) => Promise<TPLS_NEW_RETURE>;

export interface HandlerFactoryRet {
  (config: Omit<OmniConfig, 'plugins'>, tpls?: TPLS_NEW): Promise<any> | Promise<TPLS_NEW_RETURE> | Promise<{}>;
}

export interface HandlerFactory {
  (handler: PluginHandler, errMsg?: string): HandlerFactoryRet;
}

export type OmniPlugin = {
  name: string;
  stage: PluginStage;
  handler: PluginHandler;
};

export type MiddleWareCallback = (req: Request, res: Response, next: NextFunction) => void;

export type OmniConfig = {
  type: PROJECT_TYPE;
  dev?: {
    port?: number;
    logLevel?: LogLevel;
    webpack?: Configuration;
    proxy?: {
      route: string;
      config: Config;
    }[];
    middleware?: {
      route: PathParams;
      callback: MiddleWareCallback;
    }[]
  };
  build: {
    autoRelease?: boolean;
    srcDir: string;
    outDir: string;
    esmDir?: string;
    hash?: boolean;
    configuration?: (config: ANYOBJECT) => ANYOBJECT;
    tool?: BUILD;
    preflight?: {
      typescript?: boolean;
      test?: boolean;
      eslint?: boolean;
      stylelint?: boolean;
    };
    reserve?: {
      style?: boolean;
      assets?: string[];
    };
  };
  release: {
    git?: string;
    npm?: NPM | string;
    preflight?: {
      test?: boolean;
      eslint?: boolean;
      stylelint?: boolean;
      commitlint?: boolean;
      branch?: string;
    };
  };
  template: {
    root: string;
    test?: TESTFRAME;
    typescript?: boolean;
    stylesheet?: STYLE;
    readme?: [boolean, 'mdx' | 'md'];
  };
  plugins?: OmniPlugin[];
};