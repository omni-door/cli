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
})

module.exports = {
  entry: path.join(__dirname, '../src/index.${ts ? 'tsx' : 'jsx'}'),
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'server')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, "..", "src/"),
        exclude: /node_modules/,
        use: [
          {loader: 'babel-loader'}
        ]
      },
      ${ts ? `{
        test: /\.(ts|tsx)$/,
        include: path.resolve(__dirname, "..", "src/"),
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      },` : ''}
      ${style ? (style === 'css' ? `{
        test: /\.css$/,
        use:  ['style-loader', 'css-loader'],
        include: path.resolve(__dirname, "..", "src/")
      }
      ` : style === 'less' ? `{
        test: /\.css$/,
        use:  ['style-loader', 'css-loader'],
        include: path.resolve(__dirname, "..", "src/")
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
        include: path.resolve(__dirname, "..", "src/")
      }` : `{
        test: /\.css$/,
        use:  ['style-loader', 'css-loader'],
        include: path.resolve(__dirname, "..", "src/")
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        include: path.resolve(__dirname, "..", "src/")
      }`) : ''}
    ],
  },
  plugins: [
    htmlWebpackPlugin,
    new webpack.HotModuleReplacementPlugin()
  ],
  mode: 'development',
  resolve: {
    extensions: [${ts ? '".ts", ".tsx", ' : ''}".js", ".jsx", ${style ? (style === 'css' ? '".css"' : (style === 'less' ? '".less", ".css"' : '".scss", ".css"')) : ''}]
  }
};`;
}