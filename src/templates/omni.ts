
import { NPM, GenerateOmniConfigParams } from '../index.d';

export default (config: GenerateOmniConfigParams) => {
  const { project_type, build, ts, test, testFrame, eslint, commitlint, style, stylelint, git, npm, mdx } = config;

  const npmMap = {
    npm: 'https://registry.npmjs.org/',
    yarn: 'https://registry.yarnpkg.com/',
    cnpm: 'https://registry.yarnpkg.com/',
    taobao: 'https://registry.yarnpkg.com/'
  };

  return `'use strict';

const path = require('path');

module.exports = {
  // build relative config
  build: {
    // the build tool set by your initialize
    // if you want to change the build-tool, please make sure had been installed all the devDependices
    tool: '${build}',
    // The callback will be call in the build-process
    // You can return your custom build configuration
    configuration: config => {
      console.info('build config: ', config);
      return config;
    },
    // whether or not output multiple files
    multi_output: ${project_type === 'spa_react' ? 'false' : 'true'},
    // whether or not process the ts files
    typescript: ${!!ts},
    // whether or not process unit or ui test
    test: ${!!test},
    // whether or not process eslint fix and check
    eslint: ${!!eslint},
    // whether or not process style lint check
    stylelint: ${!!stylelint},
    // whether or not reserve the stylesheet files
    reserve: {
      // whether or not reserve the stylesheet files
      style: ${style && build !== 'webpack' ? true : false},
      // reserve other asset paths
      assets: []
    },
    // the build source directory
    // must be a absolute path
    src_dir: ${project_type === 'toolkit' ? 'path.resolve(\'src/toolkit\')' : 'path.resolve(\'src\')'},
    // the directory for compiled project
    // must be a absolute path
    out_dir: path.resolve('lib'),
    // es6 module compiled directory
    // set to empty string to make this invalid
    // webpack compiler not support this featrue
    // must be a absolute path
    esm_dir: path.resolve('es'),
    // auto release project after build success
    auto_release: false
  },

  // project release address config
  release: {
    // project git url
    git: '${git}',
    // npm depository url
    npm: '${npmMap[npm as NPM] || npm}',
    // whether or not process unit or ui test
    test: ${!!test},
    // whether or not process eslint fix and check
    eslint: ${!!eslint},
    // whether or not process style lint check
    stylelint: ${!!stylelint},
    // whether or not process commit lint check
    commitlint: ${!!commitlint},
    // release branch
    // only can release in this branch
    // set empty string to ignore this check
    branch: 'master'
  },

  // new template config
  template: {
    // the root directory for generate template
    // must be a absolute path
    root: ${project_type === 'toolkit' ? 'path.resolve(\'src/toolkit\')' : 'path.resolve(\'src\')'},
    // the type for generate template
    type: '${project_type}',
    // the unit test frame
    test: '${testFrame}',
    // whether or not apply typescript
    typescript: ${!!ts},
    // stylesheet type
    stylesheet: '${style === 'all' ? 'less' : style}',
    // whether or not README.md
    readme: true,
    // if generate mdx file instead of md
    mdx: ${!!mdx}
  },

  // plugins for omni cli work flow
  plugins: []
};`;
};
