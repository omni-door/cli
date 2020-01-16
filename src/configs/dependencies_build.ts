import getDependency from './dependencies_strategy';
import { BUILD } from '../index.d';

export default function (config: {
  build: BUILD;
}) {
  const dependency = getDependency('stable');
  const {
    build
  } = config;

  const buildDependencies = build === 'webpack' ? [
    dependency('webpack'),
    dependency('webpack-cli'),
    dependency('webpack-merge'),
    dependency('babel-loader'),
    dependency('ts-loader'),
    dependency('style-loader'),
    dependency('css-loader'),
    dependency('less'),
    dependency('less-loader'),
    dependency('sass-loader'),
    dependency('node-sass'),
    dependency('url-loader'),
    dependency('file-loader'),
    dependency('html-webpack-plugin'),
    dependency('@babel/core'),
    dependency('@babel/preset-env'),
    dependency('@babel/preset-react'),
    dependency('@babel/preset-typescript')
  ] : build === 'rollup' ? [
    dependency('rollup'),
    dependency('rollup-plugin-node-resolve'),
    dependency('rollup-plugin-babel'),
    dependency('rollup-plugin-commonjs'),
    dependency('rollup-plugin-node-resolve'),
    dependency('rollup-plugin-typescript'),
    dependency('rollup-plugin-typescript2'),
    dependency('rollup-plugin-json')
  ] : build === 'tsc' ? [
    dependency('typescript')
  ]
    : [];

  return buildDependencies;
}