export default function () {
  return `'use strict';

const merge = require('webpack-merge');
const common_config = require('./webpack.config.common.js');

module.exports = merge(commonConfig, {
  mode: 'production'
});`;
}