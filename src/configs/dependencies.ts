import { BUILD, TESTFRAME, STYLE, DEVSERVER, PROJECT_TYPE, STRATEGY } from '../index.d';
import getDependency from './dependencies_strategy';

interface Config {
  project_type: PROJECT_TYPE;
  build: BUILD;
  ts: boolean;
  testFrame: TESTFRAME | '';
  eslint: boolean;
  commitlint: boolean;
  style: STYLE;
  stylelint: boolean;
  devServer: DEVSERVER;
}

export function dependencies (strategy: STRATEGY, config: Config) {
  const dependency = getDependency(strategy);
  const { project_type, build } = config;
  const isReactProject = project_type === 'spa_react' || project_type === 'component_library_react';

  return [
    isReactProject ? dependency('react') : '',
    isReactProject ? dependency('react-dom') : '',
    project_type === 'spa_react' ? dependency('core-js') : '',
    project_type === 'spa_react' ? dependency('regenerator-runtime') : ''
  ];
}

export function devDependencies (strategy: STRATEGY, config: Config) {
  const dependency = getDependency(strategy);

  const {
    project_type,
    build,
    ts,
    testFrame,
    eslint,
    commitlint,
    style,
    stylelint,
    devServer
  } = config;
  const isReactProject = project_type === 'spa_react' || project_type === 'component_library_react';

  const reactDependencies = [
    dependency('react'),
    dependency('react-dom'),
    dependency('@babel/preset-react'),
    dependency('@types/react'),
    dependency('@types/react-dom')
  ];

  const loaderDependencies = [
    dependency('babel-loader'),
    style ? dependency('style-loader') : '',
    style ? dependency('css-loader') : '',
    (style === 'all' || style === 'less') ? dependency('less') : '',
    (style === 'all' || style === 'less') ? dependency('less-loader') : '',
    (style === 'all' || style === 'scss') ? dependency('sass-loader') : '',
    (style === 'all' || style === 'scss') ? dependency('node-sass') : '',
    dependency('url-loader'),
    dependency('file-loader')
  ];

  const babelDependencies = [
    dependency('@babel/core'),
    dependency('@babel/preset-env'),
    isReactProject ? dependency('@babel/preset-react') : '',
    ts ? dependency('@babel/preset-typescript') : ''
  ];

  const pluginDependencies = [
    dependency('html-webpack-plugin'),
    dependency('webpackbar')
  ];

  const buildDependencies = build === 'webpack' ? [
    dependency('webpack'),
    dependency('webpack-cli'),
    ...pluginDependencies,
    ...loaderDependencies,
    ...babelDependencies
  ] : build === 'rollup' ? [
    dependency('rollup'),
    dependency('rollup-plugin-node-resolve'),
    dependency('rollup-plugin-babel'),
    dependency('rollup-plugin-commonjs'),
    dependency('rollup-plugin-node-resolve'),
    ts ? dependency('rollup-plugin-typescript') : '',
    ts ? dependency('rollup-plugin-typescript2') : '',
    dependency('rollup-plugin-json'),
    ...babelDependencies
  ] : [];

  const tsTypesDependencies = testFrame ? testFrame === 'jest' ? [
    dependency('@types/jest'),
    dependency('@types/enzyme'),
    isReactProject ? dependency('@types/enzyme-adapter-react-16') : '',
    dependency('ts-jest')
  ] : [
    dependency('@types/chai'),
    dependency('@types/mocha')
  ] : [];

  const tsDependencies = ts ? [
    isReactProject ? dependency('@types/react') : '',
    isReactProject ? dependency('@types/react-dom') : '',
    dependency('typescript'),
    dependency('ts-node'),
    dependency('ts-loader'),
    ...tsTypesDependencies
  ] : [];

  const testDependencies = testFrame
    ? testFrame === 'jest'
      ? [
        isReactProject ? dependency('enzyme') : '',
        isReactProject ? dependency('enzyme-adapter-react-16') : '',
        dependency('jest'),
        dependency('jest-transform-stub')
      ]
      : testFrame === 'mocha'
        ? [
          dependency('chai'),
          dependency('mocha'),
          dependency('nyc'),
          dependency('karma'),
          dependency('karma-chrome-launcher'),
          dependency('karma-firefox-launcher'),
          dependency('karma-coverage'),
          dependency('karma-firefox-launcher'),
          dependency('karma-mocha'),
          dependency('karma-opera-launcher'),
          dependency('karma-safari-launcher'),
          dependency('karma-typescript'),
          dependency('karma-webpack')
        ]
        : []
    : [];

  const eslintDependencies = eslint ? [
    dependency('eslint'),
    isReactProject ? dependency('eslint-plugin-react') : '',
    ts ? dependency('@typescript-eslint/eslint-plugin') : '',
    ts ? dependency('@typescript-eslint/parser') : ''
  ] : [];

  const commitlintDependencies = commitlint ? [
    dependency('@commitlint/cli'),
    dependency('husky'),
    dependency('lint-staged')
  ] : [];

  const stylelintDependencies = stylelint ? [
    dependency('stylelint'),
    dependency('stylelint-config-standard'),
    dependency('stylelint-config-standard'),
    dependency('stylelint-config-css-modules'),
    dependency('stylelint-config-rational-order'),
    dependency('stylelint-config-prettier'),
    dependency('stylelint-order'),
    dependency('stylelint-declaration-block-no-ignored-properties'),
    style === 'all' || style === 'scss' ? dependency('stylelint-scss') : ''
  ] : [];

  const doczDependencies= [
    dependency('docz'),
    dependency('docz-theme-default'),
    dependency('docz-plugin-css'),
    dependency('react-hot-loader')
  ];

  const storybookDependencies= [
    dependency('@storybook/react'),
    dependency('@storybook/addons'),
    dependency('@storybook/addon-options'),
    dependency('@storybook/addon-actions'),
    dependency('@storybook/addon-docs'),
    dependency('@storybook/addon-info'),
    dependency('@storybook/addon-knobs'),
    dependency('@storybook/addon-links'),
    dependency('@storybook/addon-notes'),
    dependency('awesome-typescript-loader'),
    dependency('react-docgen-typescript-loader'),
    dependency('storybook-readme'),
    ...(build !== 'webpack' ? loaderDependencies : []),
    ...(build !== 'webpack' && build !== 'rollup' ? babelDependencies : [])
  ];

  const bishengDependencies = [
    dependency('bisheng'),
    dependency('bisheng-theme-one'),
    dependency('bisheng-plugin-react')
  ];

  const basicServerDependencies = [
    dependency('express'),
    build !== 'webpack' ? dependency('webpack') : '',
    dependency('webpack-dev-middleware'),
    dependency('webpack-hot-middleware'),
    dependency('http-proxy-middleware'),
    ...(build !== 'webpack' ? loaderDependencies : []),
    ...(build !== 'webpack' ? pluginDependencies : []),
    ...(build !== 'webpack' && build !== 'rollup' ? babelDependencies : []),
    ts ? dependency('@types/webpack-env'): ''
  ];

  let devServerDependencies: string[] = [];
  switch(devServer) {
    case 'docz':
      devServerDependencies = doczDependencies;
      break;
    case 'storybook':
      devServerDependencies = storybookDependencies;
      break;
    case 'bisheng':
      devServerDependencies = bishengDependencies;
      break;
    case 'basic':
      devServerDependencies = !isReactProject ? [ ...basicServerDependencies, ...reactDependencies ] : basicServerDependencies;
      break;
  }

  return {
    defaultDep: [
      dependency('@omni-door/cli'),
      dependency('del')
    ],
    buildDep: buildDependencies,
    tsDep: tsDependencies,
    testDep: testDependencies,
    eslintDep: eslintDependencies,
    commitlintDep: commitlintDependencies,
    stylelintDep: stylelintDependencies,
    devServerDep: devServerDependencies,
  };
}

