import { STYLE } from '../../index.d';

export default function (config: {
  name: string;
  ts: boolean;
  style: STYLE;
}) {
  const { name, ts, style } = config;

  return `'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const htmlWebpackPlugin = new HtmlWebpackPlugin({
  title: '${name}',
  path: path.resolve(__dirname, 'server'),
  template: path.join(__dirname, '../src/index.html'),
  filename: 'index.html'
});

module.exports = {
  entry: [
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
    path.join(__dirname, '../src/index.${ts ? 'tsx' : 'jsx'}')
  ],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'server')
  },
  module: {
    rules: [
      {
        test: /\\.(js|jsx)$/,
        include: path.resolve(__dirname, '..', 'src/'),
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      ${ts ? `{
        test: /\\.(ts|tsx)$/,
        include: path.resolve(__dirname, '..', 'src/'),
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      },` : ''}
      ${style ? (style === 'css' ? `{
        test: /\\.css$/,
        use:  ['style-loader', 'css-loader'],
        include: path.resolve(__dirname, '..', 'src/')
      },
      ` : style === 'less' ? `{
        test: /\\.(css|less)$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
        include: path.resolve(__dirname, '..', 'src/')
      },` : style === 'scss' ? `{
        test: /\\.(css|scss|sass)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        include: path.resolve(__dirname, '..', 'src/')
      },` : `{
        test: /\\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
        include: path.resolve(__dirname, '..', 'src/')
      },
      {
        test: /\.(css|scss|sass)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        include: path.resolve(__dirname, '..', 'src/')
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