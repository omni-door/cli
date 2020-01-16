import babel from './babel';
import bisheng from './bisheng';
import commitlint from './commitlint';
import eslint from './eslint';
import eslintignore from './eslintignore';
import gitignore from './gitignore';
import jest from './jest';
import karma from './karma';
import mdx from './mdx';
import mocha from './mocha';
import npmignore from './npmignore';
import omni from './omni';
import pkj from './package';
import readme from './readme';
import stylelint from './stylelint';
import tsconfig from './tsconfig';
import doczrc from './doczrc';
import component_class from './component/class_component';
import component_functional from './component/functional_component';
import component_index from './component/index';
import component_readme from './component/readme';
import component_stylesheet from './component/stylesheet';
import component_test from './component/test';
import component_mdx from './component/mdx';
import component_stories from './component/stories';
import tool_index from './component/tool/index';
import tool_readme from './component/tool/readme';
import tool_test from './component/tool/test';
import posts_readme from './posts/readme';
import source_index from './source/index';
import source_index_react from './source/index_react';
import source_html from './source/html';
import source_d from './source/declaration';
import storybook_addons from './.storybook/addons';
import storybook_config from './.storybook/config';
import storybook_mhead from './.storybook/manager-head';
import storybook_webpack from './.storybook/webpack';
import webpack_config_common from './webpack/common';
import webpack_config_dev from './webpack/dev';
import webpack_config_prod from './webpack/prod';

export { default as babel } from './babel';
export { default as bisheng} from './bisheng';
export { default as commitlint} from './commitlint';
export { default as eslint} from './eslint';
export { default as eslintignore} from './eslintignore';
export { default as gitignore} from './gitignore';
export { default as jest} from './jest';
export { default as karma} from './karma';
export { default as mdx} from './mdx';
export { default as mocha} from './mocha';
export { default as npmignore} from './npmignore';
export { default as omni} from './omni';
export { default as pkj} from './package';
export { default as readme} from './readme';
export { default as stylelint} from './stylelint';
export { default as tsconfig} from './tsconfig';
export { default as doczrc} from './doczrc';
export { default as component_class} from './component/class_component';
export { default as component_functional} from './component/functional_component';
export { default as component_index} from './component/index';
export { default as component_readme} from './component/readme';
export { default as component_stylesheet} from './component/stylesheet';
export { default as component_test} from './component/test';
export { default as component_mdx} from './component/mdx';
export { default as component_stories} from './component/stories';
export { default as tool_index} from './component/tool/index';
export { default as tool_readme} from './component/tool/readme';
export { default as tool_test} from './component/tool/test';
export { default as posts_readme} from './posts/readme';
export { default as source_index} from './source/index';
export { default as source_index_react} from './source/index_react';
export { default as source_html} from './source/html';
export { default as source_d} from './source/declaration';
export { default as storybook_addons} from './.storybook/addons';
export { default as storybook_config} from './.storybook/config';
export { default as storybook_mhead} from './.storybook/manager-head';
export { default as storybook_webpack} from './.storybook/webpack';
export { default as webpack_config_common } from './webpack/common';
export { default as webpack_config_dev } from './webpack/dev';
export { default as webpack_config_prod } from './webpack/prod';

const tpls = {
  babel,
  bisheng,
  commitlint,
  eslint,
  eslintignore,
  gitignore,
  jest,
  karma,
  mdx,
  mocha,
  npmignore,
  omni,
  pkj,
  readme,
  stylelint,
  tsconfig,
  doczrc,
  component_class,
  component_functional,
  component_index,
  component_readme,
  component_stylesheet,
  component_test,
  component_mdx,
  component_stories,
  tool_index,
  tool_readme,
  tool_test,
  posts_readme,
  source_index,
  source_index_react,
  source_html,
  source_d,
  storybook_addons,
  storybook_config,
  storybook_mhead,
  storybook_webpack,
  webpack_config_common,
  webpack_config_dev,
  webpack_config_prod
};

export type TPLS_ALL = {
  [T in keyof typeof tpls]: typeof tpls[T];
};

export type TPLS_INITIAL = Omit<TPLS_ALL,
'component_class' |
'component_functional' |
'component_index' |
'component_readme' |
'component_stylesheet' |
'component_test' |
'component_mdx' |
'component_stories' |
'tool_index' |
'tool_readme' |
'tool_test'
>;

export type TPLS_INITIAL_FN = TPLS_INITIAL[keyof TPLS_INITIAL];

export type TPLS_INITIAL_RETURE = Partial<TPLS_INITIAL>;

export type TPLS_NEW = Pick<TPLS_ALL,
'component_class' |
'component_functional' |
'component_index' |
'component_readme' |
'component_stylesheet' |
'component_test' |
'component_mdx' |
'component_stories' |
'tool_index' |
'tool_readme' |
'tool_test'
>;

export type TPLS_NEW_FN = TPLS_NEW[keyof TPLS_NEW];

export type TPLS_NEW_RETURE = Partial<TPLS_NEW>;

export default tpls;