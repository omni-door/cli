
import type {
  BUILD,
  TEST_FRAME,
  PKJ_TOOL,
  STYLE,
  LAYOUT,
  SPA_SERVER,
  COMPONENT_SERVER,
  SSR_SERVER,
  PROJECT_TYPE
} from '@omni-door/utils';

type DEV_SERVER = SPA_SERVER | COMPONENT_SERVER;

export type GInstallCli = {
  project_type: PROJECT_TYPE;
  pkgtool: PKJ_TOOL;
  build: BUILD;
  ts: boolean;
  testFrame: TEST_FRAME;
  eslint: boolean;
  prettier: boolean;
  commitlint: boolean;
  style: STYLE;
  layout?: LAYOUT;
  stylelint: boolean;
  devServer?: DEV_SERVER;
  serverType?: SSR_SERVER;
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

export const cli_pc_react: GInstallCli = {
  project_type: 'spa-react-pc',
  pkgtool: 'pnpm',
  build: 'webpack',
  ts: true,
  testFrame: '',
  eslint: true,
  prettier: true,
  commitlint: true,
  style: 'less',
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
  serverType: 'next-app'
};

export const cli_components_react: GInstallCli = {
  project_type: 'component-react',
  pkgtool: 'yarn',
  build: 'tsc',
  ts: true,
  testFrame: 'jest',
  eslint: true,
  prettier: true,
  commitlint: true,
  style: 'less',
  stylelint: true,
  devServer: 'storybook'
};

export const cli_components_vue: GInstallCli = {
  project_type: 'component-vue',
  pkgtool: 'yarn',
  build: 'tsc',
  ts: true,
  testFrame: 'jest',
  eslint: true,
  prettier: true,
  commitlint: true,
  style: 'less',
  stylelint: true,
  devServer: 'storybook'
};

export const cli_toolkit: GInstallCli = {
  project_type: 'toolkit',
  pkgtool: 'yarn',
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
  cli_pc_react,
  cli_basic_vue,
  cli_standard_vue,
  cli_entire_vue,
  cli_ssr_react,
  cli_components_react,
  cli_components_vue,
  cli_toolkit
};