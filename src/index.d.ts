export type ENV = 'prod' | 'stg' | 'sit' | 'test' | 'dev';
export type BUILD = 'webpack' | 'rollup' | 'tsc' | '';
export type NPM = 'npm' | 'hnpm';
export type CDN = 'w1' | 'w4' | 'w11';
export type TESTFRAME = 'mocha' | 'jest' | 'karma' | '';
export type PKJTOOL = 'yarn' | 'npm' | 'cnpm';
export type STYLE = 'less' | 'scss' | 'css' | '';
export type DEVSERVER = 'bisheng' | 'express' | '';

export type GenerateOmniConfigParams = {
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
    test: boolean;
    eslint: boolean;
    commitlint: boolean;
    stylelint: boolean;
    root: string;
    esmRoot: string;
    autoRelease: boolean;
  };
  release: {
    git: string;
    npm: NPM | string;
    cdn: CDN | string;
  };
  template: {
    root: string;
    test: TESTFRAME;
    typescript: boolean;
    stylesheet: STYLE;
    readme: boolean;
  };
};