
import {
  BUILD,
  TESTFRAME,
  PKJTOOL,
  STYLE,
  DEVSERVER,
  PROJECT_TYPE
} from '@omni-door/tpl-utils';

export type GInstallCli = {
  project_type: PROJECT_TYPE;
  pkgtool: PKJTOOL;
  build: BUILD;
  ts: boolean;
  testFrame: TESTFRAME;
  eslint: boolean;
  commitlint: boolean;
  style: STYLE;
  stylelint: boolean;
  devServer?: DEVSERVER;
};

export const cli_basic: GInstallCli = {
  project_type: 'spa-react',
  pkgtool: 'yarn',
  build: 'webpack',
  ts: false,
  testFrame: '',
  eslint: false,
  commitlint: false,
  style: 'css',
  stylelint: false
};

export const cli_standard: GInstallCli = {
  project_type: 'spa-react',
  pkgtool: 'yarn',
  build: 'webpack',
  ts: true,
  testFrame: '',
  eslint: true,
  commitlint: false,
  style: 'less',
  stylelint: true
};

export const cli_entire: GInstallCli = {
  project_type: 'spa-react',
  pkgtool: 'yarn',
  build: 'webpack',
  ts: true,
  testFrame: 'jest',
  eslint: true,
  commitlint: true,
  style: 'all',
  stylelint: true
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
  stylelint: false
};

export const cli_lib_components: GInstallCli = {
  project_type: 'component-library-react',
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