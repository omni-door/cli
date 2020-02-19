import { GTpls } from '../commands/initial';

type TPL = Omit<GTpls, 'name' | 'createDir'>;

export const tpl_basic: TPL = {
  project_type: 'spa-react',
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
  devServer: 'basic'
};

export const tpl_standard: TPL = {
  project_type: 'spa-react',
  build: 'webpack',
  ts: true,
  test: false,
  testFrame: '',
  eslint: true,
  commitlint: false,
  style: 'scss',
  stylelint: true,
  git: '',
  npm: '',
  devServer: 'basic'
};

export const tpl_entire: TPL = {
  project_type: 'spa-react',
  build: 'webpack',
  ts: true,
  test: true,
  testFrame: 'jest',
  eslint: true,
  commitlint: true,
  style: 'all',
  stylelint: true,
  git: '',
  npm: '',
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
  devServer: 'basic'
};

export const tpl_lib_components: TPL = {
  project_type: 'component-library-react',
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
  devServer: 'docz'
};

export default {
  tpl_basic,
  tpl_standard,
  tpl_entire,
  tpl_lib_toolkit,
  tpl_lib_components
};