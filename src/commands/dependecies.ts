import { BUILD, TESTFRAME } from '../index.d';

interface Config {
  build: BUILD;
  ts: boolean;
  testFrame: TESTFRAME | '';
  eslint: boolean;
  commitlint: boolean;
  stylelint: boolean;
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
    stylelint
  } = config;

  const babelDependencies = [
    'babel-loader',
    'style-loader',
    'css-loader',
    'less',
    'less-loader',
    'sass-loader',
    'node-sass',
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

  const tsDependencies = ts ? [
    '@types/react',
    '@types/react-dom',
    'typescript',
    'ts-node',
    'ts-loader',
    testFrame ? testFrame === 'jest' ? [
      '@types/jest',
      '@types/enzyme',
      '@types/enzyme-adapter-react-16',
      'ts-jest'
    ] : [
      '@types/chai',
      '@types/mocha'
    ] : []
  ] : [];

  const testDependencies = testFrame ? testFrame === 'jest' ? [
    'enzyme',
    'enzyme-adapter-react-16',
    'jest'
  ] : [
    'chai',
    'mocha',
    'nyc'
  ] : [];

  const eslintDependencies = eslint ? [
    'eslint'
  ] : [];

  const commitlintDependencies = commitlint ? [
    '@commitlint/cli',
    'husky',
    'lint-staged'
  ] : [];

  const stylelintDependencies = stylelint ? [
    'stylelint'
  ] : [];

  return [
    'bisheng',
    'omni-door',
    'del',
    ...buildDependencies,
    ...tsDependencies,
    ...testDependencies,
    ...eslintDependencies,
    ...commitlintDependencies,
    ...stylelintDependencies
  ];
}

