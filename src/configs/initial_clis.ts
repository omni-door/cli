import { GInstallCli } from '../commands/initial';

export const cli_basic: GInstallCli = {
  project_type: 'spa_react',
  pkgtool: 'yarn',
  build: 'webpack',
  ts: false,
  testFrame: '',
  eslint: false,
  commitlint: false,
  style: 'css',
  stylelint: false,
  devServer: 'basic',
};

export const cli_standard: GInstallCli = {
  project_type: 'spa_react',
  pkgtool: 'yarn',
  build: 'webpack',
  ts: true,
  testFrame: '',
  eslint: true,
  commitlint: false,
  style: 'scss',
  stylelint: true,
  devServer: 'basic'
};

export const cli_entire: GInstallCli = {
  project_type: 'spa_react',
  pkgtool: 'yarn',
  build: 'webpack',
  ts: true,
  testFrame: 'jest',
  eslint: true,
  commitlint: true,
  style: 'all',
  stylelint: true,
  devServer: 'basic'
};

export const cli_lib_toolkit: GInstallCli = {
  project_type: 'toolkit',
  pkgtool: 'yarn',
  build: 'rollup',
  ts: true,
  testFrame: 'mocha',
  eslint: true,
  commitlint: true,
  style: '',
  stylelint: false,
  devServer: 'basic'
};

export const cli_lib_components: GInstallCli = {
  project_type: 'component_library_react',
  pkgtool: 'yarn',
  build: 'tsc',
  ts: true,
  testFrame: 'jest',
  eslint: true,
  commitlint: true,
  style: 'less',
  stylelint: true,
  devServer: 'docz'
};

export default {
  cli_basic,
  cli_standard,
  cli_entire,
  cli_lib_toolkit,
  cli_lib_components
};