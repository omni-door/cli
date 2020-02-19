export default function (config: {
  ts: boolean;
  multiOutput: boolean;
  srcDir: string;
  outDir: string;
  esmDir: string;
  configFileName?: string;
}) {
  const { ts, multiOutput, srcDir = 'src', outDir = 'lib', esmDir, configFileName = 'omni.config.js' } = config;

  return `const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
${ts ? `const typescript = require('rollup-plugin-typescript');
const typescript2 = require('rollup-plugin-typescript2');` : ''}
const json = require('rollup-plugin-json');
const fs = require('fs');
const path = require('path');
const del = require('del');
const configs = require(path.resolve(process.cwd(), '${configFileName}'));

const { build } = configs || {};
const { configuration = config => config } = build || {};

let indexPath = '';
const exts = ['ts', 'tsx', 'js', 'jsx'];
for (let i = 0, len = exts.length; i < len; i++) {
  indexPath = path.resolve('${srcDir}', \`index.\${exts[i]}\`);
  if (fs.existsSync(indexPath)) break;
}

function clearDir () {
  ${outDir ? `del.sync('${outDir}/*');` : ''}
  ${esmDir ? `del.sync('${esmDir}/*');` : ''}
}

function flatten (arr) {
  return arr.reduce(function(prev, next){
    return prev.concat(Array.isArray(next) ? flatten(next) : next);
  }, []);
}

function createConfig () {
  const extensions = ['.ts', '.js'];
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
      filesPaths.push({
        entry: entryPath,
        file: path.join(file, 'index.js')
      });
    }
  }` : ''}

  return [{
    input: indexPath,
    output: {
      file: '${outDir}/index.js',
      format: 'cjs',
      compact: true
    },
    plugins: [
      resolve({
        extensions,
        preferBuiltins: true
      }),
      commonjs({
        namedExports: {
          'node_modules/react/react.js': [
            'Children',
            'Component',
            'PropTypes',
            'createElement',
            'createRef',
            'createContext',
            'PureComponent',
            'SFC',
            'useState',
            'useEffect',
            'useLayoutEffect',
            'useCallback',
            'useContext',
            'useMemo',
            'useReducer',
            'useRef'
          ],
          'node_modules/react-dom/index.js': ['render', 'createPortal']
        }
      }),
      ${ts ? `typescript2({
        tsconfigOverride: {
          compilerOptions: {
            target: 'es5',
            module: 'es2015'
          }
        },
        exclude: [ "**/__test__/*" ]
      }),` : ''}
      babel({
        exclude: 'node_modules/**',
        runtimeHelpers: true,
        extensions
      }),
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
            resolve({
              extensions,
              preferBuiltins: true
            }),
            commonjs({
              namedExports: {
                'node_modules/react/react.js': [
                  'Children',
                  'Component',
                  'PropTypes',
                  'createElement',
                  'createRef',
                  'createContext',
                  'PureComponent',
                  'SFC',
                  'useState',
                  'useEffect',
                  'useLayoutEffect',
                  'useCallback',
                  'useContext',
                  'useMemo',
                  'useReducer',
                  'useRef'
                ],
                'node_modules/react-dom/index.js': ['render', 'createPortal']
              }
            }),
            json(),
            ${ts ? `typescript2({
              tsconfigOverride: {
                compilerOptions: {
                  target: 'es5',
                  module: 'es2015'
                }
              },
              exclude: [ "**/__test__/*" ]
            })` : ''}
          ]
        },`
    : ''
} ...flatten(filesPaths.map(fileParams => {
      const { entry, file } = fileParams
      return [{
        input: entry,
        output: {
          file: path.resolve('${outDir}', file),
          format: 'cjs',
          exports: 'named',
          compact: true
        },
        plugins: [
          resolve({
            extensions,
            preferBuiltins: true
          }),
          commonjs({
            namedExports: {
              'node_modules/react/react.js': [
                'Children',
                'Component',
                'PropTypes',
                'createElement',
                'createRef',
                'createContext',
                'PureComponent',
                'SFC',
                'useState',
                'useEffect',
                'useLayoutEffect',
                'useCallback',
                'useContext',
                'useMemo',
                'useReducer',
                'useRef'
              ],
              'node_modules/react-dom/index.js': ['render', 'createPortal']
            }
          }),
          ${ts ? `typescript({
            target: 'es5'
          }),` : ''}
          babel({
            exclude: 'node_modules/**',
            runtimeHelpers: true,
            extensions
          }),
          json()
        ]
      }, ${
  esmDir
    ? `{
            input: entry,
            output: {
              file: path.resolve('${esmDir}', file),
              format: 'esm',
              compact: true
            },
            plugins: [
              resolve({
                extensions,
                preferBuiltins: true
              }),
              commonjs({
                namedExports: {
                  'node_modules/react/react.js': [
                    'Children',
                    'Component',
                    'PropTypes',
                    'createElement',
                    'createRef',
                    'createContext',
                    'PureComponent',
                    'SFC',
                    'useState',
                    'useEffect',
                    'useLayoutEffect',
                    'useCallback',
                    'useContext',
                    'useMemo',
                    'useReducer',
                    'useRef'
                  ],
                  'node_modules/react-dom/index.js': ['render', 'createPortal']
                }
              }),
              json(),
              ${ts ? `typescript({
                target: 'es5',
                module: 'es2015'
              })` : ''}
            ]
          }`
    : ''
}]
    }))
  ]
};

clearDir();
module.exports = configuration(createConfig());
`;
}