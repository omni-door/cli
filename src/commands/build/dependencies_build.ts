import { getDependency, arr2str, BUILD } from '@omni-door/utils';

export default function (config: {
  build: BUILD;
}) {
  const dependency = getDependency('stable', {
    '@babel/core': '~7.10.0',
    '@babel/preset-env': '~7.10.0',
    '@babel/preset-react': '~7.10.0',
    '@babel/preset-typescript': '~7.10.0',
    '@babel/plugin-transform-runtime': '~7.10.0',
    '@babel/plugin-proposal-class-properties': '~7.10.0',
    'babel-loader': '~8.1.0',
    'cache-loader': '~4.1.0',
    'css-loader': '~3.4.2',
    'cssnano': '4.1.10',
    'file-loader': '~5.0.2',
    'html-webpack-plugin': '3.2.0',
    'less': '~3.11.1',
    'less-loader': '~5.0.0',
    'mini-css-extract-plugin': '0.9.0',
    'node-sass': '4.13.1',
    'optimize-css-assets-webpack-plugin': '5.0.3',
    'sass-loader': '~8.0.2',
    'style-loader': '~1.1.3',
    'terser-webpack-plugin': '2.3.4',
    'url-loader': '~3.0.0',
    'webpack': '~4.41.6',
    'webpack-bundle-analyzer': '3.6.0',
    'webpack-cli': '~3.3.11',
    'webpack-dev-middleware': '3.7.2',
    'webpack-hot-middleware': '2.25.0',
    'webpack-merge': '4.2.2',
    'webpackbar': '4.0.0',
    'rollup': '1.31.1',
    'rollup-plugin-babel': '4.3.3',
    'rollup-plugin-commonjs': '10.1.0',
    'rollup-plugin-json': '4.0.0',
    'rollup-plugin-node-resolve': '5.2.0',
    'rollup-plugin-typescript': '1.0.1',
    'rollup-plugin-typescript2': '0.26.0',
    'typescript': '~3.7.5',
    'gulp': '4.0.2',
    'gulp-autoprefixer': '7.0.1',
    'gulp-babel': '8.0.0',
    'gulp-concat': '2.6.1',
    'gulp-cssnano': '2.1.3',
    'gulp-less': '4.0.1',
    'gulp-minify-css': '1.2.4',
    'gulp-sass': '4.1.0',
    'through2': '4.0.1'
  });
  const {
    build
  } = config;

  const buildDependencies = build === 'webpack' ? [
    dependency('webpack'),
    dependency('webpack-cli'),
    dependency('webpack-merge'),
    dependency('babel-loader'),
    dependency('cache-loader'),
    dependency('style-loader'),
    dependency('css-loader'),
    dependency('less'),
    dependency('less-loader'),
    dependency('sass-loader'),
    dependency('node-sass'),
    dependency('url-loader'),
    dependency('file-loader'),
    dependency('html-webpack-plugin'),
    dependency('terser-webpack-plugin'),
    dependency('optimize-css-assets-webpack-plugin'),
    dependency('mini-css-extract-plugin'),
    dependency('cssnano'),
    dependency('webpackbar'),
    dependency('webpack-bundle-analyzer'),
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
    dependency('rollup-plugin-json'),
    dependency('@babel/core'),
    dependency('@babel/preset-env'),
    dependency('@babel/preset-typescript')
  ] : build === 'gulp' ? [
    dependency('gulp'),
    dependency('gulp-autoprefixer'),
    dependency('gulp-babel'),
    dependency('gulp-concat'),
    dependency('gulp-cssnano'),
    dependency('gulp-less'),
    dependency('gulp-minify-css'),
    dependency('gulp-sass'),
    dependency('through2'),
    dependency('@babel/core'),
    dependency('@babel/preset-env'),
    dependency('@babel/preset-react'),
    dependency('@babel/preset-typescript'),
    dependency('@babel/plugin-transform-runtime'),
    dependency('@babel/plugin-proposal-class-properties')
  ] : build === 'tsc' ? [
    dependency('typescript')
  ]
    : [];

  return arr2str(buildDependencies);
}