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

  return `{
  "name": "${name}",
  "version": "0.0.1",
  "description": "",
  "main": "lib/index.js",
  "module": "es/index.js",
  "typings": "lib/index.d.ts",
  "scripts": {
    ${devServer ? `"start": "${devServer === 'express' ? 'node server/index.js' : 'bisheng start'}",
    "dev": "${devServer === 'express' ? 'node server/index.js' : 'bisheng start'}",` : ''}
    ${
  testFrame
    ? testFrame === 'jest' ? `"test": "jest",
      "test:snapshot": "jest --snapshot",`
      : testFrame === 'karma'
        ? `"test": "karma start --single-run && npm run test:mocha",
          "test:mocha": "nyc mocha --opts mocha.opts",
          "test:headless": "karma start --single-run --browsers ChromeHeadless karma.conf.js",
          "test:browser": "karma start --browsers Chrome"`
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
        ${eslint && `"lint:es": "eslint src/ --ext .${ts ? 'ts' : 'js'} --ext .${ts ? 'tsx' : 'jsx'}",
        "lint:es_fix": "eslint src/ --ext .${ts ? 'ts' : 'js'} --ext .${ts ? 'tsx' : 'jsx'} --fix",`}
        ${stylelint && `"lint:style": "stylelint src/**/*.{css,less,scss}",
        "lint:style_fix": "stylelint src/**/*.{css,less,scss} --fix",`}`
    : ''
}
    "new": "omni new",
    "build": "omni build",
    "release": "omni release"
  },
  ${
  commitlint
    ? `"husky": {
        "hooks": {
          "pre-commit": "lint-staged",
          "pre-push": "npm run lint && npm run test",
          "commit-msg": "npm run lint:commit"
        }
      },
      "lint-staged": {
        "src/**/*.{js,jsx,ts,tsx}": [
          "npm run lint:fix",
          "git add"
        ]
      },`
    : ''
}
  "keywords": [],
  "author": "",
  "license": "ISC"
}`;
};

