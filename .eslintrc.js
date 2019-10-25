module.exports = {
	"env": {
		"node": true,
		"es6": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:@typescript-eslint/eslint-recommended"
	],
	"globals": {
		"Atomics": "readonly",
		"SharedArrayBuffer": "readonly"
	},
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"ecmaFeatures": {
			module: true,
			ts: true,
			tsx: true
		},
		"ecmaVersion": 2018,
		"sourceType": "module"
	},
	"plugins": [
		"@typescript-eslint"
	],
	"rules": {
		"no-console": ["error", {
			"allow": ["warn", "error", "info"]
		}],
		"@typescript-eslint/indent": ["warn", 2],
		"quotes": ["error", "single"],
		"semi": ["error", "always"],
		"no-unused-vars": ["warn"],
		"no-useless-escape": ["warn"]
	}
};