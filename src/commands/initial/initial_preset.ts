
import type {
  BUILD,
  TESTFRAME,
  PKJTOOL,
  STYLE,
  LAYOUT,
  SPASERVER,
  COMPONENTSERVER,
  SSRSERVER,
  PROJECT_TYPE
} from '@omni-door/utils';

type DEVSERVER = SPASERVER | COMPONENTSERVER;

export type GInstallCli = {
  project_type: PROJECT_TYPE;
  pkgtool: PKJTOOL;
  build: BUILD;
  ts: boolean;
  testFrame: TESTFRAME;
  eslint: boolean;
  prettier: boolean;
  commitlint: boolean;
  style: STYLE;
  layout?: LAYOUT;
  stylelint: boolean;
  devServer?: DEVSERVER;
  serverType?: SSRSERVER;
};

export const cli_basic_react: GInstallCli = {
  project_type: 'spa-react',
  pkgtool: 'pnpm',
  build: 'webpack',
  ts: false,
  testFrame: '',
  eslint: false,
  prettier: false,
  commitlint: false,
  style: 'css',
  layout: 'px',
  stylelint: false
};

export const cli_standard_react: GInstallCli = {
  project_type: 'spa-react',
  pkgtool: 'pnpm',
  build: 'webpack',
  ts: true,
  testFrame: '',
  eslint: true,
  prettier: true,
  commitlint: false,
  style: 'less',
  layout: 'px',
  stylelint: true
};

export const cli_entire_react: GInstallCli = {
  project_type: 'spa-react',
  pkgtool: 'pnpm',
  build: 'webpack',
  ts: true,
  testFrame: 'jest',
  eslint: true,
  prettier: true,
  commitlint: true,
  style: 'all',
  layout: 'px',
  stylelint: true
};

export const cli_basic_vue: GInstallCli = {
  project_type: 'spa-vue',
  pkgtool: 'pnpm',
  build: 'webpack',
  ts: false,
  testFrame: '',
  eslint: false,
  prettier: false,
  commitlint: false,
  style: 'css',
  layout: 'px',
  stylelint: false
};

export const cli_standard_vue: GInstallCli = {
  project_type: 'spa-vue',
  pkgtool: 'pnpm',
  build: 'webpack',
  ts: true,
  testFrame: '',
  eslint: true,
  prettier: true,
  commitlint: false,
  style: 'less',
  layout: 'px',
  stylelint: true
};

export const cli_entire_vue: GInstallCli = {
  project_type: 'spa-vue',
  pkgtool: 'pnpm',
  build: 'webpack',
  ts: true,
  testFrame: 'jest',
  eslint: true,
  prettier: true,
  commitlint: true,
  style: 'all',
  layout: 'px',
  stylelint: true
};

export const cli_ssr_react: GInstallCli = {
  project_type: 'ssr-react',
  pkgtool: 'pnpm',
  build: 'next',
  ts: true,
  testFrame: 'jest',
  eslint: true,
  prettier: true,
  commitlint: true,
  style: 'all',
  stylelint: true,
  serverType: 'next'
};

export const cli_components_react: GInstallCli = {
  project_type: 'component-react',
  pkgtool: 'pnpm',
  build: 'tsc',
  ts: true,
  testFrame: 'jest',
  eslint: true,
  prettier: true,
  commitlint: true,
  style: 'less',
  stylelint: true,
  devServer: 'docz'
};

export const cli_toolkit: GInstallCli = {
  project_type: 'toolkit',
  pkgtool: 'pnpm',
  build: 'rollup',
  ts: true,
  testFrame: 'mocha',
  eslint: true,
  prettier: true,
  commitlint: true,
  style: '',
  stylelint: false
};

export default {
  cli_basic_react,
  cli_standard_react,
  cli_entire_react,
  cli_basic_vue,
  cli_standard_vue,
  cli_entire_vue,
  cli_ssr_react,
  cli_components_react,
  cli_toolkit
};