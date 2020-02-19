import { STYLE } from '../../index.d';

export default function (config: {
  ts: boolean;
  style: STYLE;
  configFileName: string;
}) {
  const { ts, style, configFileName } = config;

  return `'use strict';

const path = require('path');
const WebpackBar = require('webpackbar');

const cliConfig = require(path.resolve(__dirname, '../${configFileName}'));
const hash = cliConfig && cliConfig.build && cliConfig.build.hash;


module.exports = {
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
      {
        test: /\\.(woff|woff2|eot|ttf|svg|jpg|png|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: hash ? 'assets/[name].[hash:8].[ext]' : 'assets/[name].[ext]'
            }
          }
        ]
      }
    ],
  },
  plugins: [
    new WebpackBar()
  ],
  resolve: {
    extensions: [${ts ? '".ts", ".tsx", ' : ''}".js", ".jsx", ${style ? (style === 'css' ? '".css"' : (style === 'less' ? '".less", ".css"' : style === 'scss' ? '".scss", ".css", ".sass"' : '".scss", ".less", ".css", ".sass"')) : ''}]
  }
};`;
}