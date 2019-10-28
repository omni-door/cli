import { STYLE } from '../../index.d';

export default function (config: {
  ts: boolean;
  style: STYLE;
}) {
  const { ts, style } = config;

  return `'use strict';

const path = require('path');

module.exports = {
  entry: path.join(__dirname, '../src/index.${ts ? 'ts' : 'js'}'),
  output: {
    filename: '[name]/index.js',
    path: path.resolve(__dirname, '../lib')
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
  plugins: [],
  mode: 'production',
  resolve: {
    extensions: [${ts ? '".ts", ".tsx", ' : ''}".js", ".jsx", ${style ? (style === 'css' ? '".css"' : (style === 'less' ? '".less", ".css"' : '".scss", ".css"')) : ''}]
  }
};
`;
}