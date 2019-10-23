

interface Config {
  test: boolean;
  eslint: boolean;
  commitlint: boolean;
  stylelint: boolean;
  git?: string;
  npm: 'npm' | 'hnpm';
  cdn: 'w1' | 'w4';
}

export default (config: Config) => {
  const { test, eslint, commitlint, stylelint, git, npm, cdn } = config;

  const npmMap = {
    npm: 'https://registry.npmjs.org/',
    hnpm: 'http://hnpm.hupu.io/'
  };

  const cdnMap = {
    w1: 'https://w1.hoopchina.com.cn/',
    w4: 'https://w4.hoopchina.com.cn/',
    w11: 'https://w11.hoopchina.com.cn/'
  };

  return `
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
    // whether or not auto release after build
    autoRelease: false
  },

  // project release address config
  release: {
    // project git url
    git: '${git || 'your git repo url'}',
    // npm depository url
    npm: '${npmMap[npm] || npm}',
    // cdn url
    cdn: '${cdnMap[cdn] || cdn}',
    // version iterate strategy
    version: 'auto'
  },

  // new template config
  template: {
    // the root directory for generate template
    root: path.resolve('src/components')
  }
};
  `;
};
