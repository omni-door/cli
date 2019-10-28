import { ANYOBJECT } from '../../index.d';

export default function (config: {
  ts: boolean;
  multi_output: boolean;
  src_dir: string;
  out_dir: string;
  esm_dir: string;
  custom_exports?: ANYOBJECT;
}) {
  const { ts, multi_output, src_dir = 'src', out_dir = 'lib', esm_dir, custom_exports } = config;

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
    const filePath = path.resolve(__dirname, '../${src_dir}', file);
    const stats = await stat(filePath);
    if (stats.isDirectory()) {
      filesPaths.push({
        entry: filePath + '/index.ts',
        file: path.join(file, 'index.js')
      });
    }
  }` : ''}

  return [{
    input: '${src_dir}/index.${ts ? 'ts' : 'js'}',
    output: {
      file: '${out_dir}/index.js',
      format: 'cjs',
      compact: true
    },
    plugins: [
      resolve({ extensions }),
      commonjs(),
      ${ts ? `typescript2({
        tsconfigOverride: {
          compilerOptions: {
            target: 'es5',
            module: 'es2015'
          }
        },
        exclude: [ "**/__test__/*.test.${ts ? 'ts' : 'js'}" ]
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
          input: '${src_dir}/index.${ts ? 'ts' : 'js'}',
          output: {
            file: '${esm_dir}/index.js',
            format: 'esm',
            compact: true
          },
          plugins: [
            resolve({ extensions }),
            commonjs(),
            ${ts ? `typescript2({
              tsconfigOverride: {
                compilerOptions: {
                  target: 'es5',
                  module: 'es2015'
                }
              },
              exclude: [ "**/__test__/*.test.${ts ? 'ts' : 'js'}" ]
            })` : ''}
          ]
        },`
    : ''
} ...flatten(filesPaths.map(fileParams => {
      const { entry, file } = fileParams
      return [{
        input: entry,
        output: {
          file: '${out_dir}/' + file,
          format: 'cjs',
          exports: 'named',
          compact: true
        },
        plugins: [
          resolve({ extensions }),
          commonjs(),
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
              file: '${esm_dir}/' + file,
              format: 'esm',
              compact: true
            },
            plugins: [
              resolve({ extensions }),
              commonjs(),
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
module.exports = ${
  custom_exports
    ? custom_exports
    : 'createConfig();'
}
`;
}