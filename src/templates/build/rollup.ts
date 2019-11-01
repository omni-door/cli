export default function (config: {
  ts: boolean;
}) {
  const { ts } = config;

  return `import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
${ts ? `import typescript from 'rollup-plugin-typescript';
import typescript2 from 'rollup-plugin-typescript2';` : ''}
import { uglify } from 'rollup-plugin-uglify';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import del from 'del';

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
async function clearDir () {
  await del.sync('lib/*');
  await del.sync('es/*');
}

function flatten (arr) {
  return arr.reduce(function(prev, next){
    return prev.concat(Array.isArray(next) ? flatten(next) : next);
  }, []);
}

async function createConfig () {
  const extensions = ['.ts', '.js'];
  const filesPaths = [];
  const files = await readdir('src');
  const len = files.length;
  for (let i = 0; i < len; i++) {
    const file = files[i];
    const filePath = path.resolve(__dirname, '../src', file);
    const stats = await stat(filePath);
    if (stats.isDirectory()) {
      filesPaths.push({
        entry: filePath + '/index.ts',
        file: path.join(file, 'index.js')
      });
    }
  }

  return [{
    input: 'src/index.${ts ? 'ts' : 'js'}',
    output: {
      file: 'lib/index.js',
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
    ]}, {
      input: 'src/index.${ts ? 'ts' : 'js'}',
      output: {
        file: 'es/index.js',
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
    }, ...flatten(filesPaths.map(fileParams => {
      const { entry, file } = fileParams
      return [{
        input: entry,
        output: {
          file: 'lib/' + file,
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
      }, {
        input: entry,
        output: {
          file: 'es/' + file,
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
      }]
    }))
  ]
};

clearDir();
module.exports = createConfig();`;
}