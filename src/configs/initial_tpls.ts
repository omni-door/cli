import { GTpls } from '../commands/initial';

type TPL = Omit<GTpls, 'name' | 'createDir'>;

export const tpl_simple: TPL = {
  project_type: 'spa_react',
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
  cdn: '',
  devServer: 'basic'
};

export const tpl_standard: TPL = {
  project_type: 'spa_react',
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
  cdn: '',
  devServer: 'basic'
};

export const tpl_entire: TPL = {
  project_type: 'spa_react',
  build: 'webpack',
  ts: true,
  test: true,
  testFrame: 'jest',
  eslint: true,
  commitlint: true,
  style: 'less',
  stylelint: true,
  git: '',
  npm: '',
  cdn: '',
  devServer: 'basic'
};

export const tpl_lib_toolkit: TPL = {
  project_type: 'toolkit',
  build: 'rollup',
  ts: true,
  test: true,
  testFrame: 'mocha',
  eslint: true,
  commitlint: true,
  style: '',
  stylelint: false,
  git: '',
  npm: '',
  cdn: '',
  devServer: 'basic'
};

export const tpl_lib_components: TPL = {
  project_type: 'component_library_react',
  build: 'tsc',
  ts: true,
  test: true,
  testFrame: 'jest',
  eslint: true,
  commitlint: true,
  style: 'less',
  stylelint: true,
  git: '',
  npm: '',
  cdn: '',
  devServer: 'docz'
};

export default {
  tpl_simple,
  tpl_standard,
  tpl_entire,
  tpl_lib_toolkit,
  tpl_lib_components
};