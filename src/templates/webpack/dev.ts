import { PROJECT_TYPE, STYLE } from '../../index.d';

export default function (config: {
  project_type: PROJECT_TYPE;
  name: string;
  style: STYLE;
  ts: boolean;
}) {
  const { project_type, name, style, ts } = config;
  const isReactSPAProject = project_type === 'spa_react';

  return `'use strict';

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonConfig = require('./webpack.config.common.js');

module.exports = merge(commonConfig, {
  mode: 'development',
  entry: [
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
    path.join(__dirname, ${isReactSPAProject ? `'../src/index.${ts ? 'tsx' : 'jsx'}'` : `'../demo/index.${ts ? 'tsx' : 'jsx'}'`})
  ],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, ${isReactSPAProject ? '\'../src\'' : '\'../demo\''})
  },
  module: {
    rules: [
      ${style ? (style === 'css' ? `{
        test: /\\.css$/,
        use:  ['style-loader', 'css-loader']
      }
      ` : style === 'less' ? `{
        test: /\\.(css|less)$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },` : style === 'scss' ? `{
        test: /\\.(css|scss|sass)$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }` : `{
        test: /\\.css$/,
        use:  ['style-loader', 'css-loader']
      },{
        test: /\\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.(scss|sass)$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }`) : ''}
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: '${name}',
      path: path.resolve(__dirname, ${isReactSPAProject ? '\'../src\'' : '\'../demo\''}),
      template: path.join(__dirname, ${isReactSPAProject ? '\'../src/index.html\'' : '\'../demo/index.html\''}),
      filename: 'index.html'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
});`;
}