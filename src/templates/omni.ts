
import { NPM, CDN } from '../index.d';

export default (config: {
  ts: boolean;
  test: boolean;
  testFrame: string;
  eslint: boolean;
  commitlint: boolean;
  stylelint: boolean;
  git?: string;
  npm: NPM | string;
  cdn: CDN | string;
}) => {
  const { ts, test, testFrame, eslint, commitlint, stylelint, git, npm, cdn } = config;

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
    // whether or not process unit or ui test
    test: ${test},
    // whether or not process eslint fix and check
    eslint: ${eslint},
    // whether or not process commit lint check
    commitlint: ${commitlint},
    // whether or not process style lint check
    stylelint: ${stylelint},
    // the root directory for compiled project
    root: path.resolve('lib'),
    // es6 module compiled directory
    esmRoot: path.resolve('es')
  },

  // project release address config
  release: {
    // project git url
    git: '${git}',
    // npm depository url
    npm: '${npmMap[npm as NPM] || npm}',
    // cdn url
    cdn: '${cdnMap[cdn as CDN] || cdn}'
  },

  // new template config
  template: {
    // the root directory for generate template
    root: path.resolve('src'),
    // the unit test frame
    test: '${testFrame}',
    // whether or not apply typescript
    typescript: ${ts},
    // whether or not README.md
    readme: true
  }
};
  `;
};
