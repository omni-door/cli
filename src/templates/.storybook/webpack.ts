import { STYLE } from '../../index.d';

export default function (config: {
  ts: boolean;
  style: STYLE;
}) {
  const { ts, style } = config;

  return `'use strict';

const path = require('path');

module.exports = {
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
        use: [
          {
            loader: require.resolve('awesome-typescript-loader'),
          },
          {
            loader: require.resolve('react-docgen-typescript-loader'),
          },
        ]
      },` : ''}
      ${style ? (style === 'css' ? `{
        test: /\.css$/,
        use:  ['style-loader', 'css-loader'],
        exclude: /node_modules(?!\\/@storybook\\/addon-info)/
      }` : style === 'less' ? `{
        test: /\.(css|less)$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
        exclude: /node_modules(?!\\/@storybook\\/addon-info)/
      }` : style === 'scss' ? `{
        test: /\.(css|scss|sass)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        exclude: /node_modules(?!\\/@storybook\\/addon-info)/
      }` : `{
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.(css|scss|sass)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        exclude: /node_modules(?!\\/@storybook\\/addon-info)/
      }`) : ''}
    ],
  },
  plugins: [],
  mode: 'development',
  resolve: {
    extensions: [${ts ? '".ts", ".tsx", ' : ''}".js", ".jsx", ".md", ${style ? (style === 'css' ? '".css"' : (style === 'less' ? '".less", ".css"' : '".scss", ".css", ".sass"')) : ''}]
  }
};`;
}
