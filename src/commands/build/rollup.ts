export default function (config: {
  ts: boolean;
  multiOutput: boolean;
  srcDir: string;
  outDir: string;
  esmDir: string;
  configurationPath?: string;
  configFileName?: string;
  pkjFieldName?: string;
}) {
  const { ts, multiOutput, srcDir = 'src', outDir = 'lib', esmDir, configurationPath, pkjFieldName = 'omni', configFileName = 'omni.config.js' } = config;

  return `'use strict';

const fs = require('fs');
const path = require('path');
const { require_cwd, logErr } = require('@omni-door/utils');
const { nodeResolve: resolve_new } = require_cwd('@rollup/plugin-node-resolve', true);
const resolve_old = require_cwd('rollup-plugin-node-resolve', true);
const commonjs_new = require_cwd('@rollup/plugin-commonjs', true);
const commonjs_old = require_cwd('rollup-plugin-commonjs', true);
const { babel: babel_new } = require_cwd('@rollup/plugin-babel', true);
const babel_old = require_cwd('rollup-plugin-babel', true);
const json_new = require_cwd('@rollup/plugin-json', true);
const json_old = require_cwd('rollup-plugin-json', true);
${ts ? `const typescript_new = require_cwd('@rollup/plugin-typescript', true);
const typescript_old = require_cwd('rollup-plugin-typescript', true);
const typescript2 = require_cwd('rollup-plugin-typescript2');
` : ''}
const ppkj = require_cwd('./package.json');
const configFilePath = (ppkj && ppkj.${pkjFieldName} && ppkj.${pkjFieldName}.filePath) || './${configFileName}';
const configs = require_cwd(configFilePath);
${configurationPath ? `const customConfig = require('${configurationPath}')
` : ''}
const babel = babel_new || babel_old;
const resolve = resolve_new || resolve_old;
const commonjs = commonjs_new || commonjs_old;
const json = json_new || json_old;
${ts ? `const typescript = typescript_new || typescript_old;
` : ''}
const { build } = configs || {};
const { configuration = config => config } = build || {};

const extensions = ['.ts', '.js'];
const tsExcludes = ['**/__test__/*'];
const babelConfig = babel_new ? {
  exclude: 'node_modules/**',
  plugins: [['@babel/plugin-transform-runtime', { corejs: 3 }]],
  babelHelpers: 'runtime',
  extensions
} : {
  exclude: 'node_modules/**',
  runtimeHelpers: true,
  extensions
};
const resolveConfig = {
  extensions,
  preferBuiltins: true,
  browser: true
};
const commonConfig = commonjs_new? void 0 : {
  namedExports: {
    'react': [
      'Children',
      'Component',
      'PropTypes',
      'createElement',
      'createRef',
      'createContext',
      'PureComponent',
      'cloneElement',
      'memo',
      'createFactory',
      'isValidElement',
      'forwardRef',
      'Fragment',
      'lazy',
      'Suspense',
      'SFC',
      'FC',
      'useState',
      'useEffect',
      'useContext',
      'useReducer',
      'useCallback',
      'useMemo',
      'useRef',
      'useImperativeHandle',
      'useLayoutEffect',
      'useDebugValue'
    ],
    'react-dom': [
      'render',
      'hydrate',
      'unmountComponentAtNode',
      'findDOMNode',
      'createPortal',
      'renderToString',
      'renderToStaticMarkup',
      'renderToNodeStream',
      'renderToStaticNodeStream'
    ]
  }
};

let indexPath = '';
const exts = ['ts', 'tsx', 'jsx', 'js'];
for (let i = 0, len = exts.length; i < len; i++) {
  indexPath = path.resolve('${srcDir}', \`index.\${exts[i]}\`);
  if (fs.existsSync(indexPath)) break;
  if (i === len - 1) {
    logErr('请以 index 为名称指定正确的入口文件！(Please specify the correct entry file with name of index)');
    process.exit(1);
  }
}

function flatten (arr) {
  return arr.reduce(function(prev, next){
    return prev.concat(Array.isArray(next) ? flatten(next) : next);
  }, []);
}

function createConfig () {
  const filesPaths = [];
  ${multiOutput ? `const files = fs.readdirSync('${srcDir}');
  const len = files.length;
  for (let i = 0; i < len; i++) {
    const file = files[i];
    const filePath = path.resolve('${srcDir}', file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      let entryPath = '';
      for (let i = 0, len = exts.length; i < len; i++) {
        entryPath = path.resolve(filePath, \`index.\${exts[i]}\`);
        if (fs.existsSync(entryPath)) break;
      }
      if (!fs.existsSync(entryPath) || fs.existsSync(path.resolve(filePath, '.buildignore'))) {
        tsExcludes.push(\`\${filePath}/*\`);
        continue;
      }
      filesPaths.push({
        entry: entryPath,
        file: path.join(file, 'index.js'),
        dir: file
      });
    }
  }
  ` : ''}
  return [{
    input: indexPath,
    output: {
      file: '${outDir}/index.js',
      format: 'cjs',
      exports: 'named',
      compact: true
    },
    plugins: [
      resolve(resolveConfig),
      commonjs(commonConfig),
      ${ts ? `typescript2({
        tsconfigOverride: {
          compilerOptions: {
            target: 'es5',
            module: 'es2015'
          },
          exclude: tsExcludes
        }
      }),` : ''}
      babel(babelConfig),
      json()
    ]}, ${
  esmDir
    ? `{
          input: indexPath,
          output: {
            file: '${esmDir}/index.js',
            format: 'esm',
            compact: true
          },
          plugins: [
            resolve(resolveConfig),
            commonjs(commonConfig),
            json(),
            ${ts ? `typescript2({
              tsconfigOverride: {
                compilerOptions: {
                  target: 'es5',
                  module: 'es2015'
                },
                exclude: tsExcludes
              }
            })` : ''}
          ]
        },`
    : ''
} ...flatten(filesPaths.map(fileParams => {
      const { entry, file, dir } = fileParams
      return [{
        input: entry,
        output: {
          dir: path.resolve('${outDir}', dir),
          format: 'cjs',
          exports: 'named',
          compact: true
        },
        plugins: [
          resolve(resolveConfig),
          commonjs(commonConfig),
          ${ts ? `typescript({
            target: 'es5',
            outDir: path.resolve('${outDir}', file),
            exclude: tsExcludes
          }),` : ''}
          babel(babelConfig),
          json()
        ]
      }, ${
  esmDir
    ? `{
            input: entry,
            output: {
              dir: path.resolve('${esmDir}', dir),
              format: 'esm',
              compact: true
            },
            plugins: [
              resolve(resolveConfig),
              commonjs(commonConfig),
              json(),
              ${ts ? `typescript({
                target: 'es5',
                module: 'es2015',
                outDir: path.resolve('${esmDir}', file),
                exclude: tsExcludes
              })` : ''}
            ]
          }`
    : ''
}]
    }))
  ]
};

module.exports = ${
  configurationPath
    ? 'customConfig'
    : 'configuration(createConfig());'
}
`;
}