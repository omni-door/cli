import { TPLS_ALL, TPLS_RETURE, TPLS_INITIAL, TPLS_INITIAL_RETURE, TPLS_NEW, TPLS_NEW_RETURE } from './templates';
export { TPLS_ALL, TPLS_RETURE, TPLS_INITIAL, TPLS_INITIAL_RETURE, TPLS_NEW, TPLS_NEW_RETURE } from './templates';
export type ENV = 'prod' | 'stg' | 'sit' | 'test' | 'dev';
export type BUILD = 'webpack' | 'rollup' | 'tsc' | '';
export type NPM = 'npm' | 'yarn' | 'cnpm' | 'taobao';
export type PROJECT_TYPE = 'spa_react' | 'component_library_react' | 'toolkit';
export type TESTFRAME = 'mocha' | 'jest' | 'karma' | '';
export type PKJTOOL = 'yarn' | 'npm' | 'cnpm';
export type STYLE = 'less' | 'scss' | 'css' | 'all' | '';
export type DEVSERVER = 'basic' | 'docz' | 'storybook' | 'bisheng' | '';
export type ANYOBJECT = { [propName: string]: any };

export type GenerateOmniConfigParams = {
  project_type: PROJECT_TYPE;
  build: BUILD;
  ts: boolean;
  test: boolean;
  testFrame: string;
  eslint: boolean;
  commitlint: boolean;
  style: STYLE;
  stylelint: boolean;
  git?: string;
  npm: NPM | string;
  cdn: string;
  mdx: boolean;
};

export type PluginStage = 'new' | 'build' | 'release';
export interface PluginHandler {
  <T extends TPLS_NEW>(config: Omit<OmniConfig, 'plugins'>, tpls?: T): T extends TPLS_NEW ? Promise<TPLS_NEW_RETURE> : Promise<any>;
}
export type OmniPlugin = {
  stage: PluginStage;
  handler: PluginHandler;
};

export type OmniConfig = {
  build: {
    tool: BUILD;
    configuration?: (config: ANYOBJECT) => ANYOBJECT;
    multi_output?: boolean;
    typescript?: boolean;
    test?: boolean;
    eslint?: boolean;
    stylelint?: boolean;
    reserve?: {
      style?: boolean;
      assets?: string[];
    }
    src_dir: string;
    out_dir: string;
    esm_dir?: string;
    auto_release?: boolean;
  };
  release: {
    git?: string;
    npm?: NPM | string;
    cdn?: string;
    test?: boolean;
    eslint?: boolean;
    stylelint?: boolean;
    commitlint?: boolean;
    branch?: string;
  };
  template: {
    root: string;
    type?: PROJECT_TYPE;
    test?: TESTFRAME;
    typescript?: boolean;
    stylesheet?: STYLE;
    readme?: boolean;
    mdx?: boolean;
  };
  plugins?: OmniPlugin[];
};