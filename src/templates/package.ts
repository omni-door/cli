import { TESTFRAME, DEVSERVER } from '../index.d';

export default (config: {
  name: string;
  ts: boolean;
  devServer: DEVSERVER;
  testFrame: TESTFRAME;
  eslint: boolean;
  commitlint: boolean;
  stylelint: boolean;
}) => {
  const { name, ts, devServer, testFrame, eslint, commitlint, stylelint } = config;

  let devScript = '';
  let demoScript = '';
  switch(devServer) {
    case 'docz':
      devScript = 'docz dev';
      demoScript = `docz build --base /.${name}`;
      break;
    case 'storybook':
      devScript = 'start-storybook -p 6200';
      demoScript = `build-storybook -c .storybook -o .${name}`;
      break;
    case 'bisheng':
      devScript = 'bisheng start';
      demoScript = 'bisheng build';
      break;
    case 'basic':
      devScript = 'node server/index.js';
      break;
  }

  return `{
  "name": "${name}",
  "version": "0.0.1",
  "description": "",
  "main": "lib/index.js",
  "module": "es/index.js",
  "typings": "lib/index.d.ts",
  "scripts": {
    ${devScript ? `"start": "${devScript}",
    "dev": "${devScript}",` : ''}
    ${
  testFrame
    ? testFrame === 'jest' ? `"test": "jest",
      "test:snapshot": "jest --updateSnapshot",`
      : testFrame === 'karma'
        ? `"test": "karma start --single-run && npm run test:mocha",
          "test:mocha": "nyc mocha --opts mocha.opts",
          "test:headless": "karma start --single-run --browsers ChromeHeadless karma.conf.js",
          "test:browser": "karma start --browsers Chrome",`
        : '"test": "nyc mocha --opts mocha.opts",'
    : ''
}
    ${
  eslint || stylelint
    ? `"lint": "${
      eslint && stylelint
        ? 'npm run lint:es && npm run lint:style'
        : eslint
          ? 'npm run lint:es'
          : 'npm run lint:style'
    }",
        "lint:fix": "${
  eslint && stylelint
    ? 'npm run lint:es_fix && npm run lint:style_fix'
    : eslint
      ? 'npm run lint:es_fix'
      : 'npm run lint:style_fix'
}",
        ${eslint ? `"lint:es": "eslint src/ --ext .${ts ? 'ts' : 'js'} --ext .${ts ? 'tsx' : 'jsx'}",
        "lint:es_fix": "eslint src/ --ext .${ts ? 'ts' : 'js'} --ext .${ts ? 'tsx' : 'jsx'} --fix",` : ''}
        ${stylelint ? `"lint:style": "stylelint src/**/*.{css,less,scss,sass}",
        "lint:style_fix": "stylelint src/**/*.{css,less,scss,sass} --fix",` : ''}`
    : ''
}
    ${
  commitlint
    ? '"lint:commit": "commitlint -e $HUSKY_GIT_PARAMS",'
    : ''
}
    "new": "omni new",
    "build": "omni build",
    ${
  demoScript
    ? `"build:demo": "${demoScript}",`
    : ''
}
    "release": "omni release"
  },
  ${
  commitlint
    ? `"husky": {
        "hooks": {
          "pre-commit": "lint-staged",
          "pre-push": ${
  (eslint || stylelint) && testFrame
    ? '"npm run lint && npm run test"'
    : (eslint || stylelint)
      ? '"npm run lint"'
      : testFrame
        ? '"npm run test"'
        : ''},
          "commit-msg": "npm run lint:commit"
        }
      },
      "lint-staged": {
        ${eslint ? `"src/**/*.{js,jsx,ts,tsx,css}": [
          "npm run lint:es_fix",
          "git add"
        ]${eslint && stylelint ? ',' : ''}` : ''}
        ${stylelint ? `"src/**/*.{scss,sass,less}": [
          "npm run lint:style_fix",
          "git add"
        ]` : ''}
      },`
    : ''
}
  "keywords": [],
  "author": "",
  "license": "ISC"
}`;
};

