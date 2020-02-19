import { STYLE } from '../../index.d';

export default function (config: {
  style: STYLE;
  configFileName: string;
}) {
  const { style, configFileName } = config;

  return `'use strict';

const merge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const common_config = require('./webpack.config.common.js');
const cli_config = require('../${configFileName}');

module.exports = merge(common_config, {
  module: {
    rules: [
      ${style ? (style === 'css' ? `{
        test: /\\.css$/,
        use:  [MiniCssExtractPlugin.loader, 'css-loader']
      },
      ` : style === 'less' ? `{
        test: /\\.(css|less)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
      },` : style === 'scss' ? `{
        test: /\\.(css|scss|sass)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },` : `{
        test: /\\.css$/,
        use:  [MiniCssExtractPlugin.loader, 'css-loader']
      },{
        test: /\\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
      },
      {
        test: /\.(scss|sass)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },`) : ''}
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          output: {
            comments: false
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorOptions: {
          reduceIndents: false,
          autoprefixer: false
        }
      })
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        polyfill: {
          chunks: 'all',
          test: /(core-js|regenerator-runtime)/,
          enforce: true,
          name: 'polyfill',
          priority: 110
        },
        vendors: {
          chunks: 'all',
          test: /(react|react-dom|react-router|react-router-dom)/,
          enforce: true,
          name: 'vendors',
          priority: 100
        },
        asyncs: {
          chunks: 'async',
          enforce: true,
          name: 'chunk_async',
          priority: 90
        },
        commons: {
          chunks: 'all',
          test: /(axios)/,
          enforce: true,
          name: 'chunk',
          priority: 80
        }
      }
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: cli_config && cli_config.build && cli_config.build.hash ? '[name].[hash:8].css' : '[name].css',
      chunkFilename: '[id].css'
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      defaultSizes: 'parsed',
      reportFilename: './bundle_analysis.html'
    })
  ],
  mode: 'production'
});`;
}