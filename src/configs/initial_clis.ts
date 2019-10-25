import { GInstallCli } from '../commands/initial';

export const cli_simple: GInstallCli = {
  pkgtool: 'npm',
  build: 'webpack',
  ts: false,
  testFrame: '',
  eslint: false,
  commitlint: false,
  stylelint: false
};

export const cli_standard: GInstallCli = {
  pkgtool: 'npm',
  build: 'webpack',
  ts: true,
  testFrame: '',
  eslint: true,
  commitlint: false,
  stylelint: true
};

export const cli_entire: GInstallCli = {
  pkgtool: 'npm',
  build: 'webpack',
  ts: true,
  testFrame: '',
  eslint: true,
  commitlint: true,
  stylelint: true
};

export const cli_lib_utils: GInstallCli = {
  pkgtool: 'npm',
  build: 'rollup',
  ts: true,
  testFrame: 'mocha',
  eslint: true,
  commitlint: true,
  stylelint: false
};

export const cli_lib_components: GInstallCli = {
  pkgtool: 'npm',
  build: 'tsc',
  ts: true,
  testFrame: 'jest',
  eslint: true,
  commitlint: true,
  stylelint: true
};

export default {
  cli_simple,
  cli_standard,
  cli_entire,
  cli_lib_utils,
  cli_lib_components
};