import { GTpls } from '../commands/initial';

type TPL = Omit<GTpls, 'name'>;

export const tpl_simple: TPL = {
  build: 'webpack',
  ts: false,
  test: false,
  testFrame: '',
  eslint: false,
  commitlint: false,
  style: 'css',
  stylelint: false,
  git: '',
  npm: '',
  cdn: 'w1'
};

export const tpl_standard: TPL = {
  build: 'webpack',
  ts: true,
  test: false,
  testFrame: '',
  eslint: true,
  commitlint: false,
  style: 'less',
  stylelint: true,
  git: '',
  npm: '',
  cdn: 'w1'
};

export const tpl_entire: TPL = {
  build: 'webpack',
  ts: true,
  test: true,
  testFrame: 'jest',
  eslint: true,
  commitlint: true,
  style: 'less',
  stylelint: true,
  git: '',
  npm: 'hnpm',
  cdn: 'w1'
};

export const tpl_lib_utils: TPL = {
  build: 'rollup',
  ts: true,
  test: true,
  testFrame: 'mocha',
  eslint: true,
  commitlint: true,
  style: '',
  stylelint: false,
  git: '',
  npm: 'npm',
  cdn: ''
};

export const tpl_lib_components: TPL = {
  build: 'tsc',
  ts: true,
  test: true,
  testFrame: 'jest',
  eslint: true,
  commitlint: true,
  style: 'less',
  stylelint: true,
  git: '',
  npm: 'hnpm',
  cdn: ''
};

export default {
  tpl_simple,
  tpl_standard,
  tpl_entire,
  tpl_lib_utils,
  tpl_lib_components
};