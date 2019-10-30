import { BUILD } from '../index.d';

export default function (config: {
  build: BUILD;
}) {
  const {
    build
  } = config;

  const buildDependencies = build === 'webpack' ? [
    'webpack',
    'webpack-cli',
    'babel-loader',
    'ts-loader',
    'style-loader',
    'css-loader',
    'less',
    'less-loader',
    'sass-loader',
    'node-sass',
    '@babel/core',
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/plugin-transform-typescript'
  ] : build === 'rollup' ? [
    'rollup',
    'rollup-plugin-node-resolve',
    'rollup-plugin-babel',
    'rollup-plugin-commonjs',
    'rollup-plugin-node-resolve',
    'rollup-plugin-uglify',
    'rollup-plugin-typescript',
    'rollup-plugin-typescript2'
  ] : build === 'tsc' ? [
    'typescript'
  ]
    : [];

  return buildDependencies;
}