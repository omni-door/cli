
import { NPM, CDN, GenerateOmniConfigParams } from '../index.d';

export default (config: GenerateOmniConfigParams) => {
  const { build, ts, test, testFrame, eslint, commitlint, style, stylelint, git, npm, cdn, mdx } = config;

  const npmMap = {
    npm: 'https://registry.npmjs.org/',
    hnpm: 'http://hnpm.hupu.io/'
  };

  const cdnMap = {
    w1: 'https://w1.hoopchina.com.cn/',
    w4: 'https://w4.hoopchina.com.cn/',
    w11: 'https://w11.hoopchina.com.cn/'
  };

  return `'use strict';

const path = require('path');

module.exports = {
  // build relative config
  build: {
    // the build tool set by your initialize
    // if you want to change the tool, please make sure your install all the devDependices
    tool: '${build}',
    // The callback will be call when the build process
    // You can return your custom build configuration
    configuration: config => {
      console.info('build config: ', config);
      return config;
    },
    // whether or not output multiple files
    multi_output: false,
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
    src_dir: path.resolve('src'),
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
    // cdn url
    cdn: '${cdnMap[cdn as CDN] || cdn}',
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
    root: path.resolve('src'),
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
