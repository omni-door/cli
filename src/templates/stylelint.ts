import { STYLE } from './../index.d';

export default function (config: {
  style: STYLE;
}) {
  const { style } = config;

  return `'use strict';

module.exports = {
	extends: [
		"stylelint-config-standard",
		"stylelint-config-css-modules",
		"stylelint-config-rational-order",
		"stylelint-config-prettier"
	],
	plugins: [
		"stylelint-order",
		${style === 'all' || style === 'scss' ? '"stylelint-scss",' : ''}
		"stylelint-declaration-block-no-ignored-properties"
	],
	rules: {
		"no-descending-specificity": null,
		${style === 'all' || style === 'scss' ? `"at-rule-no-unknown": null,
    "scss/selector-no-redundant-nesting-selector": true,` : ''}
		"plugin/declaration-block-no-ignored-properties": true
	}
};`;
}

