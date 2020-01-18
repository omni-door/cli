import { STYLE } from '../../index.d';

export default function (config: {
  ts: boolean;
  style: STYLE;
}) {
  const { ts, style } = config;

  return `'use strict';

const WebpackBar = require('webpackbar');

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
              limit: 8192,
              name: 'assets/[name].[hash:8].[ext]'
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