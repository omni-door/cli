export default function (config: {
  ts: boolean;
}) {
  const { ts } = config;

  return `'use strict';

module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": [
    ${ts ? `"eslint:recommended",
		"plugin:@typescript-eslint/eslint-recommended"` : '"eslint:recommended"'}
	],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  ${ts ? '"parser": "@typescript-eslint/parser"' : ''},
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": [
    ${ts ? `"react",
    "@typescript-eslint"` : '"react"'}
  ],
  "rules": {
  }
};`;
}