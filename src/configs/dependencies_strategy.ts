import { STRATEGY } from '../index.d';

const dependencies = {
  'core-js': '3',
  'react': '16.12.0',
  'react-dom': '16.12.0',
  'regenerator-runtime': '0.13.3'
};

const devDependencies = {
  '@babel/core': '7.7.7',
  '@babel/preset-env': '7.7.7',
  '@babel/preset-react': '7.7.4',
  '@babel/preset-typescript': '7.7.7',
  '@commitlint/cli': '8.3.4',
  '@types/enzyme': '3.10.4',
  '@types/enzyme-adapter-react-16': '1.0.5',
  '@types/jest': '24.0.25',
  '@types/react': '16.9.17',
  '@types/react-dom': '16.9.4',
  '@types/vfile-message': '1.0.1',
  '@types/webpack-env': '1.15.0',
  '@typescript-eslint/eslint-plugin': '2.15.0',
  '@typescript-eslint/parser': '2.15.0',
  'babel-loader': '8.0.6',
  'css-loader': '3.4.1',
  'del': '5.1.0',
  'detect-port': '1.3.0',
  'enzyme': '3.11.0',
  'enzyme-adapter-react-16': '1.15.2',
  'eslint': '6.8.0',
  'eslint-plugin-react': '7.17.0',
  'express': '4.17.1',
  'file-loader': '5.0.2',
  'html-webpack-plugin': '3.2.0',
  'http-proxy-middleware': '0.20.0',
  'ip': '1.1.5',
  'husky': '4.0.4',
  'jest': '24.9.0',
  'jest-transform-stub': '2.0.0',
  'less': '3.10.3',
  'less-loader': '5.0.0',
  'lint-staged': '9.5.0',
  'node-sass': '4.13.0',
  'open': '7.0.0',
  'sass-loader': '8.0.0',
  'style-loader': '1.1.2',
  'stylelint': '12.0.1',
  'stylelint-config-css-modules': '2.1.0',
  'stylelint-config-prettier': '8.0.0',
  'stylelint-config-rational-order': '0.1.2',
  'stylelint-config-standard': '19.0.0',
  'stylelint-declaration-block-no-ignored-properties': '2.2.0',
  'stylelint-order': '4.0.0',
  'stylelint-scss': '3.13.0',
  'ts-jest': '24.3.0',
  'ts-loader': '6.2.1',
  'ts-node': '8.6.0',
  'typescript': '3.7.4',
  'url-loader': '3.0.0',
  'webpack': '4.41.5',
  'webpack-cli': '3.3.10',
  'webpack-dev-middleware': '3.7.2',
  'webpack-hot-middleware': '2.25.0',
  'webpack-merge': '4.2.2',
  'webpackbar': '4.0.0',
  'docz': '1.3.2',
  'docz-plugin-css': '0.11.0',
  'docz-theme-default': '1.2.0',
  'react-hot-loader': '4.12.16',
  '@storybook/react': '5.2.5',
  '@storybook/addons': '5.2.5',
  '@storybook/addon-options': '5.2.5',
  '@storybook/addon-actions': '5.2.5',
  '@storybook/addon-docs': '5.2.5',
  '@storybook/addon-info': '5.2.5',
  '@storybook/addon-knobs': '5.2.5',
  '@storybook/addon-links': '5.2.5',
  '@storybook/addon-notes': '5.2.5',
  'awesome-typescript-loader': '5.2.1',
  'react-docgen-typescript-loader': '3.3.0',
  'storybook-readme': '5.0.8',
  '@omni-door/cli': 'latest',
  '@types/chai': '4.2.7',
  '@types/mocha': '5.2.7',
  'chai': '4.2.0',
  'mocha': '7.0.0',
  'nyc': '15.0.0',
  'rollup': '1.29.0',
  'rollup-plugin-babel': '4.3.3',
  'rollup-plugin-commonjs': '10.1.0',
  'rollup-plugin-json': '4.0.0',
  'rollup-plugin-node-resolve': '5.2.0',
  'rollup-plugin-typescript': '1.0.1',
  'rollup-plugin-typescript2': '0.25.3',
  'bisheng': '1.4.6',
  'bisheng-plugin-react': '1.1.1',
  'bisheng-theme-one': '0.2.30',
  'karma': '4.4.1',
  'karma-chrome-launcher': '3.1.0',
  'karma-coverage': '2.0.1',
  'karma-firefox-launcher': '1.3.0',
  'karma-mocha': '1.3.0',
  'karma-opera-launcher': '1.0.0',
  'karma-safari-launcher': '1.0.0',
  'karma-typescript': '4.1.1',
  'karma-webpack': '4.0.2'
};

type dependenciesKey = keyof typeof dependencies;
type devDependenciesKey = keyof typeof devDependencies;

export function getDependency (strategy: STRATEGY) {
  return function (key: dependenciesKey | devDependenciesKey) {
    if (strategy === 'latest') {
      return `${key}@latest`;
    }

    return `${key}@${dependencies[key as dependenciesKey] || devDependencies[key as devDependenciesKey] || 'latest'}`;
  };
}

export default getDependency;