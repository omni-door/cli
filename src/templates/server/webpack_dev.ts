import { STYLE, PROJECT_TYPE } from '../../index.d';

export default function (config: {
  project_type: PROJECT_TYPE;
  name: string;
  ts: boolean;
  style: STYLE;
}) {
  const { project_type, name, ts, style } = config;
  const isReactSPAProject = project_type === 'spa_react';

  return `'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const htmlWebpackPlugin = new HtmlWebpackPlugin({
  title: '${name}',
  path: path.resolve(__dirname, 'server'),
  template: path.join(__dirname, ${isReactSPAProject ? '\'../src/index.html\'' : '\'../index.html\''}),
  filename: 'index.html'
});

module.exports = {
  entry: [
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
    path.join(__dirname, ${isReactSPAProject ? `'../src/index.${ts ? 'tsx' : 'jsx'}'` : `'../index.${ts ? 'tsx' : 'jsx'}'`})
  ],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'server')
  },
  module: {
    rules: [
      {
        test: /\\.(js|jsx)$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      ${ts ? `{
        test: /\\.(ts|tsx)$/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      },` : ''}
      ${style ? (style === 'css' ? `{
        test: /\\.css$/,
        use:  ['style-loader', 'css-loader']
      },
      ` : style === 'less' ? `{
        test: /\\.(css|less)$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },` : style === 'scss' ? `{
        test: /\\.(css|scss|sass)$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },` : `{
        test: /\\.css$/,
        use:  ['style-loader', 'css-loader']
      },{
        test: /\\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.(scss|sass)$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },`) : ''}
      {
        test: /\\.(woff|woff2|eot|ttf|svg|jpg|png|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }
    ],
  },
  plugins: [
    htmlWebpackPlugin,
    new webpack.HotModuleReplacementPlugin()
  ],
  mode: 'development',
  resolve: {
    extensions: [${ts ? '".ts", ".tsx", ' : ''}".js", ".jsx", ${style ? (style === 'css' ? '".css"' : (style === 'less' ? '".less", ".css"' : style === 'scss' ? '".scss", ".css", ".sass"' : '".scss", ".less", ".css", ".sass"')) : ''}]
  }
};`;
}