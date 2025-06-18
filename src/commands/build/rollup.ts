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
const { requireCwd, logErr } = require('@omni-door/utils');
const { nodeResolve: resolve } = requireCwd('@rollup/plugin-node-resolve', true) || {};
const commonjs = requireCwd('@rollup/plugin-commonjs', true);
const { babel } = requireCwd('@rollup/plugin-babel', true) || {};
const json = requireCwd('@rollup/plugin-json', true);
${ts ? `const typescript = requireCwd('@rollup/plugin-typescript', true);
` : ''}
const pkj = requireCwd('./package.json');
const configFilePath = (pkj && pkj.${pkjFieldName} && pkj.${pkjFieldName}.filePath) || './${configFileName}';
const configs = requireCwd(configFilePath);
${configurationPath ? `const customConfig = require('${configurationPath}')
` : ''}
const { build } = configs || {};
const { configuration = getConfig => getConfig(true) } = build || {};

const extensions = ['.ts', '.js'];
const tsExcludes = ['node_modules/**', '**/__test__/*'];
const babelConfig = {
  exclude: 'node_modules/**',
  plugins: [['@babel/plugin-transform-runtime', { useESModules: false, corejs: 3 }]],
  babelHelpers: 'runtime',
  extensions
};
const resolveConfig = {
  extensions,
  preferBuiltins: true,
  browser: true
};
const tsconfig = {
  cjs: (dir = '', emit = false) => ({
    compilerOptions: {
      target: 'es5',
      module: 'esnext',
      declaration: emit,
      outDir: path.resolve('${outDir}', dir),
      emitDeclarationOnly: emit
    },
    exclude: tsExcludes
  }),
  esm: (dir = '', emit = false) => ({
    compilerOptions: {
      target: 'esnext',
      module: 'esnext',
      declaration: emit,
      outDir: path.resolve('${esmDir}', dir),
      emitDeclarationOnly: emit
    },
    exclude: tsExcludes
  })
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

function createConfig (bundle = true) {
  const filesPaths = [];
  ${multiOutput ? `const getEntryPath = (files, preDir) => {
    const len = files.length;
    for (let i = 0; i < len; i++) {
      const file = files[i];
      if (file.includes('test')) continue;
      const preDirPath = path.join(preDir, file);
      const filePath = path.resolve('${srcDir}', preDirPath);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        getEntryPath(fs.readdirSync(filePath), preDirPath);
      } else {
        let entryPath = '';
        const extArr = path.extname(filePath).split('.');
        entryPath = (extArr.length && !!~exts.indexOf(extArr[1])) ? filePath : '';
        if (!entryPath || !fs.existsSync(entryPath) || fs.existsSync(path.resolve(filePath, '.buildignore'))) {
          tsExcludes.push(\`\${filePath}/*\`);
          continue;
        }
        filesPaths.push({
          entry: entryPath,
          file: path.join(file, 'index.js'),
          dir: preDir
        });
      }
    }
  };
  getEntryPath(fs.readdirSync('${srcDir}'), '');
  ` : ''}
  return bundle ? [
    {
      input: indexPath,
      output: {
        file: '${outDir}/index.js',
        format: 'cjs',
        exports: 'named',
        compact: true
      },
      plugins: [
        resolve(resolveConfig),
        commonjs(),
        ${ts ? 'typescript(tsconfig.cjs(\'\', true)),' : ''}
        babel(babelConfig),
        json()
      ]
    },
${esmDir
    ? `
    {
      input: indexPath,
      output: {
        file: '${esmDir}/index.js',
        format: 'esm',
        compact: true
      },
      plugins: [
        resolve(resolveConfig),
        commonjs({ transformMixedEsModules: true, esmExternals: true }),
        ${ts ? 'typescript(tsconfig.esm(\'\', true)),' : ''}
        json()
      ]
    },`
    : ''}

    ...flatten(filesPaths.map(fileParams => {
      const { entry, file, dir } = fileParams;
      return [
        {
          input: entry,
          output: {
            dir: path.resolve('${outDir}', dir),
            format: 'cjs',
            exports: 'named',
            compact: true
          },
          plugins: [
            resolve(resolveConfig),
            commonjs(),
            ${ts ? 'typescript(tsconfig.cjs(dir)),' : ''}
            json()
          ]
        },
${esmDir
    ? `
        {
          input: entry,
          output: {
            dir: path.resolve('${esmDir}', dir),
            format: 'esm',
            compact: true
          },
          plugins: [
            resolve(resolveConfig),
            commonjs({ transformMixedEsModules: true, esmExternals: true }),
            ${ts ? 'typescript(tsconfig.esm(dir)),' : ''}
            json()
          ]
        }`
    : ''}
      ];
    }))
  ] : [
   {
      input: indexPath,
      output: {
        dir: '${outDir}',
        format: 'cjs',
        exports: 'named',
        compact: true,
        preserveModules: true,
        preserveModulesRoot: '${srcDir}'
      },
      plugins: [
        resolve(resolveConfig),
        commonjs(),
        ${ts ? 'typescript(tsconfig.cjs(\'\', true)),' : ''}
        babel(babelConfig),
        json()
      ]
    },
${esmDir
    ? `
    {
      input: indexPath,
      output: {
        dir: '${esmDir}',
        format: 'esm',
        compact: true,
        preserveModules: true,
        preserveModulesRoot: '${srcDir}'
      },
      plugins: [
        resolve(resolveConfig),
        commonjs({ transformMixedEsModules: true, esmExternals: true }),
        ${ts ? 'typescript(tsconfig.esm(\'\', true)),' : ''}
        json()
      ]
    },`
    : ''}
  ]
};

module.exports = ${
  configurationPath
    ? 'typeof customConfig === \'function\' ? customConfig((bundle = true) => createConfig(bundle)) : customConfig'
    : 'configuration((bundle = true) => createConfig(bundle));'
}
`;
}