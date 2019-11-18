import { BUILD, TESTFRAME, STYLE, DEVSERVER } from '../index.d';

interface Config {
  build: BUILD;
  ts: boolean;
  testFrame: TESTFRAME | '';
  eslint: boolean;
  commitlint: boolean;
  style: STYLE;
  stylelint: boolean;
  devServer: DEVSERVER;
}

export function dependencies () {
  return [
    'react',
    'react-dom'
  ];
}

export function devDependencies (config: Config) {
  const {
    build,
    ts,
    testFrame,
    eslint,
    commitlint,
    style,
    stylelint,
    devServer
  } = config;

  const loaderDependencies = [
    'babel-loader',
    style ? 'style-loader' : '',
    style ? 'css-loader' : '',
    style === 'all' || style === 'less' ? 'less' : '',
    style === 'all' || style === 'less' ? 'less-loader' : '',
    style === 'all' || style === 'scss' ? 'sass-loader' : '',
    style === 'all' || style === 'scss' ? 'node-sass' : '',
    'url-loader',
    'file-loader'
  ];

  const babelDependencies = [
    '@babel/core',
    '@babel/preset-env',
    '@babel/preset-react',
    ts ? '@babel/preset-typescript' : ''
  ];

  const pluginDependencies = [
    'html-webpack-plugin'
  ];

  const buildDependencies = build === 'webpack' ? [
    'webpack',
    'webpack-cli',
    ...pluginDependencies,
    ...loaderDependencies,
    ...babelDependencies
  ] : build === 'rollup' ? [
    'rollup',
    'rollup-plugin-node-resolve',
    'rollup-plugin-babel',
    'rollup-plugin-commonjs',
    'rollup-plugin-node-resolve',
    'rollup-plugin-uglify',
    ts ? 'rollup-plugin-typescript' : '',
    ts ? 'rollup-plugin-typescript2' : '',
    ...babelDependencies
  ] : [];

  const tsTypesDependencies = testFrame ? testFrame === 'jest' ? [
    '@types/jest',
    '@types/enzyme',
    '@types/enzyme-adapter-react-16',
    'ts-jest'
  ] : [
    '@types/chai',
    '@types/mocha'
  ] : [];

  const tsDependencies = ts ? [
    '@types/react',
    '@types/react-dom',
    'typescript',
    'ts-node',
    'ts-loader',
    ...tsTypesDependencies
  ] : [];

  const testDependencies = testFrame
    ? testFrame === 'jest'
      ? [
        'enzyme',
        'enzyme-adapter-react-16',
        'jest',
        'jest-transform-stub'
      ]
      : testFrame === 'karma'
        ? [
          'chai',
          'mocha',
          'nyc',
          'karma',
          'karma-chrome-launcher',
          'karma-firefox-launcher',
          'karma-coverage',
          'karma-firefox-launcher',
          'karma-mocha',
          'karma-opera-launcher',
          'karma-safari-launcher',
          'karma-typescript',
          'karma-webpack'
        ]
        : [
          'chai',
          'mocha',
          'nyc'
        ]
    : [];

  const eslintDependencies = eslint ? [
    'eslint',
    'eslint-plugin-react',
    ts ? '@typescript-eslint/eslint-plugin' : '',
    ts ? '@typescript-eslint/parser' : ''
  ] : [];

  const commitlintDependencies = commitlint ? [
    '@commitlint/cli',
    'husky',
    'lint-staged'
  ] : [];

  const stylelintDependencies = stylelint ? [
    'stylelint',
    'stylelint-config-standard',
    'stylelint-config-standard',
    'stylelint-config-css-modules',
    'stylelint-config-rational-order',
    'stylelint-config-prettier',
    'stylelint-order',
    'stylelint-declaration-block-no-ignored-properties',
    style === 'all' || style === 'scss' ? 'stylelint-scss' : ''
  ] : [];

  const doczDependencies= [
    'docz@1.3.2',
    'docz-theme-default@1.2.0',
    'docz-plugin-css@0.11.0',
    'react-hot-loader@4.12.16'
  ];

  const storybookDependencies= [
    '@storybook/react@5.2.5',
    '@storybook/addons@5.2.5',
    '@storybook/addon-options@5.2.5',
    '@storybook/addon-actions@5.2.5',
    '@storybook/addon-actions@5.2.5',
    '@storybook/addon-docs@5.2.5',
    '@storybook/addon-info@5.2.5',
    '@storybook/addon-knobs@5.2.5',
    '@storybook/addon-links@5.2.5',
    '@storybook/addon-notes@5.2.5',
    'awesome-typescript-loader@5.2.1',
    'react-docgen-typescript-loader@3.3.0',
    'storybook-readme@5.0.8',
    ...(build !== 'webpack' ? loaderDependencies : []),
    ...(build !== 'webpack' && build !== 'rollup' ? babelDependencies : [])
  ];

  const bishengDependencies = [
    'bisheng',
    'bisheng-theme-one',
    'bisheng-plugin-react'
  ];

  const basicServerDependencies = [
    'express',
    build !== 'webpack' ? 'webpack' : '',
    'webpack-dev-middleware',
    'webpack-hot-middleware',
    'http-proxy-middleware',
    ...(build !== 'webpack' ? loaderDependencies : []),
    ...(build !== 'webpack' ? pluginDependencies : []),
    ...(build !== 'webpack' && build !== 'rollup' ? babelDependencies : []),
    ts ? '@types/webpack-env': ''
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
      devServerDependencies = basicServerDependencies;
      break;
  }

  return {
    defaultDep: [
      '@omni-door/cli',
      'del'
    ],
    buildDep: buildDependencies,
    tsDep: tsDependencies,
    testDep: testDependencies,
    eslintDep: eslintDependencies,
    commitlintDep: commitlintDependencies,
    stylelintDep: stylelintDependencies,
    devServerDep: devServerDependencies
  };
}

