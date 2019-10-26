export type ENV = 'prod' | 'stg' | 'sit' | 'test' | 'dev';
export type BUILD = 'webpack' | 'rollup' | 'tsc' | '';
export type NPM = 'npm' | 'hnpm';
export type CDN = 'w1' | 'w4' | 'w11';
export type TESTFRAME = 'mocha' | 'jest' | 'karma' | '';
export type PKJTOOL = 'yarn' | 'npm' | 'cnpm';
export type STYLE = 'less' | 'scss' | 'css' | '';

export type OmniConfig = {
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