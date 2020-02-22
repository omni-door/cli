import { Configuration } from 'webpack';
export { Configuration } from 'webpack';
import { Config } from 'http-proxy-middleware';
export { Config } from 'http-proxy-middleware';
import { Request, Response, NextFunction } from 'express';
export { Request, Response, NextFunction } from 'express';
import { PathParams } from 'express-serve-static-core';
export { PathParams } from 'express-serve-static-core';
import { BUILD, PROJECT_TYPE, PKJTOOL, STYLE, DEVSERVER, STRATEGY, PLUGINSTAGE, TESTFRAME, LOGLEVEL } from '@omni-door/tpl-utils';
export type ANYOBJECT = { [propName: string]: any };

export interface PluginHandler {
  (config: Omit<OmniConfig, 'plugins'>): Promise<any>;
}

export interface HandlerFactoryRet {
  (config: Omit<OmniConfig, 'plugins'>): Promise<any>;
}

export interface HandlerFactory {
  (handler: PluginHandler, errMsg?: string): HandlerFactoryRet;
}

export type OmniPlugin = {
  name: string;
  stage: PLUGINSTAGE;
  handler: PluginHandler;
};

export type MiddleWareCallback = (req: Request, res: Response, next: NextFunction) => void;

export type OmniConfig = {
  type: PROJECT_TYPE;
  dev?: {
    port?: number;
    logLevel?: LOGLEVEL;
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
    npm?: string;
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
    test?: boolean;
    typescript?: boolean;
    stylesheet?: STYLE;
    readme?: [boolean, 'mdx' | 'md'];
  };
  plugins?: OmniPlugin[];
};