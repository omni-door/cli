import { STYLE, PROJECT_TYPE } from '../../index.d';

export default function (config: {
  project_type: PROJECT_TYPE;
  name: string;
  ts: boolean;
}) {
  const { project_type, name, ts } = config;
  const isReactSPAProject = project_type === 'spa_react';

  return `'use strict';

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBar = require('webpackbar');
const common_config = require('./webpack.config.common.js');

const htmlWebpackPlugin = new HtmlWebpackPlugin({
  title: '${name}',
  path: path.resolve(__dirname, ${isReactSPAProject ? '../src' : '../demo'}),
  template: path.join(__dirname, ${isReactSPAProject ? '\'../src/index.html\'' : '\'../demo/index.html\''}),
  filename: 'index.html'
});

module.exports = merge(commonConfig, {
  mode: 'development',
  entry: [
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
    path.join(__dirname, ${isReactSPAProject ? `'../src/index.${ts ? 'tsx' : 'jsx'}'` : `'../demo/index.${ts ? 'tsx' : 'jsx'}'`})
  ],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, ${isReactSPAProject ? '../src' : '../demo'})
  },
  plugins: [
    htmlWebpackPlugin,
    new webpack.HotModuleReplacementPlugin()
  ]
});`;
}