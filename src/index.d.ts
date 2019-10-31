export type ENV = 'prod' | 'stg' | 'sit' | 'test' | 'dev';
export type BUILD = 'webpack' | 'rollup' | 'tsc' | '';
export type NPM = 'npm' | 'hnpm';
export type CDN = 'w1' | 'w4' | 'w11';
export type TESTFRAME = 'mocha' | 'jest' | 'karma' | '';
export type PKJTOOL = 'yarn' | 'npm' | 'cnpm';
export type STYLE = 'less' | 'scss' | 'css' | '';
export type DEVSERVER = 'basic' | 'bisheng' | '';
export type ANYOBJECT = { [propName: string]: any };

export type GenerateOmniConfigParams = {
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
  cdn: CDN | string;
};

export type OmniConfig = {
  build: {
    tool: BUILD;
    configuration: (config: ANYOBJECT) => ANYOBJECT;
    multi_output: boolean;
    typescript: boolean;
    test: boolean;
    eslint: boolean;
    stylelint: boolean;
    src_dir: string;
    out_dir: string;
    esm_dir: string;
    auto_release: boolean;
  };
  release: {
    git: string;
    npm: NPM | string;
    cdn: CDN | string;
    test: boolean;
    eslint: boolean;
    stylelint: boolean;
    commitlint: boolean;
    branch: string;
  };
  template: {
    root: string;
    test: TESTFRAME;
    typescript: boolean;
    stylesheet: STYLE;
    readme: boolean;
  };
};