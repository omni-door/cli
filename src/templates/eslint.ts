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
    ${
  ts
    ? `"@typescript-eslint/indent": ["warn", 2],
        "@typescript-eslint/no-empty-interface": ["warn"],
        "@typescript-eslint/camelcase": ["off"],
        "@typescript-eslint/restrict-plus-operands": ["warn"],
        "@typescript-eslint/array-type": ["off"],
        "@typescript-eslint/no-use-before-define": ["off"],
        "@typescript-eslint/no-angle-bracket-type-assertion": ["off"],
        "@typescript-eslint/interface-name-prefix": ["off"],
        "@typescript-eslint/explicit-member-accessibility": ["warn"],
        "@typescript-eslint/consistent-type-assertions": ["warn"],
        "@typescript-eslint/no-inferrable-types": ["warn"],`
    : ''
}
    "no-console": ["error", {
			"allow": ["warn", "error", "info"]
    }],
    "indent": ["warn", 2],
    "semi": ["error", "always"],
    "prefer-spread": ["warn"],
    "no-unused-vars": ["warn"],
    "no-extra-semi": ["warn"],
    "quotes": ["error", "single"],
    "linebreak-style": ["warn", "unix"]
  }
};`;
}