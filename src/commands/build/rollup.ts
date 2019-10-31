export default function (config: {
  ts: boolean;
  multi_output: boolean;
  src_dir: string;
  out_dir: string;
  esm_dir: string;
}) {
  const { ts, multi_output, src_dir = 'src', out_dir = 'lib', esm_dir } = config;

  return `const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
${ts ? `const typescript = require('rollup-plugin-typescript');
const typescript2 = require('rollup-plugin-typescript2');` : ''}
const { uglify } = require('rollup-plugin-uglify');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const del = require('del');
const omni_config = require(path.resolve(process.cwd(), 'omni.config.js'));

const { build } = omni_config || {};
const { configuration = config => config } = build || {};

let indexPath = '';
const exts = ['ts', 'tsx', 'js', 'jsx'];
for (let i = 0, len = exts.length; i < len; i++) {
  indexPath = path.resolve('${src_dir}', \`index.\${exts[i]}\`);
  if (fs.existsSync(indexPath)) break;
}

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
async function clearDir () {
  ${out_dir ? `await del.sync('${out_dir}/*');` : ''}
  ${esm_dir ? `await del.sync('${esm_dir}/*');` : ''}
}

function flatten (arr) {
  return arr.reduce(function(prev, next){
    return prev.concat(Array.isArray(next) ? flatten(next) : next);
  }, []);
}

async function createConfig () {
  const extensions = ['.ts', '.js'];
  const filesPaths = [];
  ${multi_output ? `const files = await readdir('${src_dir}');
  const len = files.length;
  for (let i = 0; i < len; i++) {
    const file = files[i];
    const filePath = path.resolve('${src_dir}', file);
    const stats = await stat(filePath);
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
      file: '${out_dir}/index.js',
      format: 'cjs',
      compact: true
    },
    plugins: [
      resolve({ extensions }),
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
      uglify()
    ]}, ${
  esm_dir
    ? `{
          input: indexPath,
          output: {
            file: '${esm_dir}/index.js',
            format: 'esm',
            compact: true
          },
          plugins: [
            resolve({ extensions }),
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
            })` : ''}
          ]
        },`
    : ''
} ...flatten(filesPaths.map(fileParams => {
      const { entry, file } = fileParams
      return [{
        input: entry,
        output: {
          file: path.resolve('${out_dir}', file),
          format: 'cjs',
          exports: 'named',
          compact: true
        },
        plugins: [
          resolve({ extensions }),
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
          uglify()
        ]
      }, ${
  esm_dir
    ? `{
            input: entry,
            output: {
              file: path.resolve('${esm_dir}', file),
              format: 'esm',
              compact: true
            },
            plugins: [
              resolve({ extensions }),
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