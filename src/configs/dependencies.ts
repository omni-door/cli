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

  const babelDependencies = [
    'babel-loader',
    style ? 'style-loader' : '',
    style ? 'css-loader' : '',
    style === 'less' ? 'less' : '',
    style === 'less' ? 'less-loader' : '',
    style === 'scss' ? 'sass-loader' : '',
    style === 'scss' ? 'node-sass' : '',
    '@babel/core',
    '@babel/preset-env',
    '@babel/preset-react',
    ts ? '@babel/plugin-transform-typescript' : ''
  ];

  const buildDependencies = build === 'webpack' ? [
    'webpack',
    'webpack-cli',
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
    'stylelint-declaration-block-no-ignored-properties'
  ] : [];

  const bishengDependencies = [
    'bisheng',
    'bisheng-theme-one'
  ];

  const basicServerDependencies = [
    'express',
    'webpack',
    'webpack-dev-middleware',
    'html-webpack-plugin'
  ];

  const devServerDependencies = devServer ? (devServer === 'basic' ? basicServerDependencies : bishengDependencies) : [];

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

