import { STYLE } from '../index.d';

export default function (config: {
  name: string;
  ts: boolean;
  style: STYLE;
}) {
  const { name, ts, style } = config;
  return `'use strict';
const { css } = require('docz-plugin-css');

module.exports = {
  title: '${name}',
  typescript: ${ts ? true : false},
  src: './src/',
  files: '**/*.{md,markdown,mdx}',
  port: 6200,
  plugins: [
    css({
      preprocessor: '${style === 'scss' ? 'sass' : style}',
      cssmodules: true
    })
  ]
};`;
}

