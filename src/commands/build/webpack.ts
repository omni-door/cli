import path from 'path';
/* import types */
import type { HASH } from '@omni-door/utils';

export default function (config: {
  ts: boolean;
  multiOutput: boolean;
  srcDir: string;
  outDir: string;
  configurationPath?: string;
  pkjFieldName?: string;
  configFileName?: string;
  hash?: boolean | HASH;
}) {
  const { multiOutput, srcDir = path.resolve(__dirname, '../src/'), outDir = path.resolve(__dirname, '../lib/'), configurationPath, pkjFieldName = 'omni', configFileName = 'omni.config.js', hash } = config;
  const hashType = 
    typeof hash === 'string'
      ? hash
      : hash
        ? 'contenthash'
        : hash;

  return `'use strict';

const fs = require('fs');
const path = require('path');
const { require_cwd } = require('@omni-door/utils');
const merge = require_cwd('webpack-merge');

const cwd = process.cwd();
const ppkj = require_cwd('./package.json');
const configFilePath = (ppkj && ppkj.${pkjFieldName} && ppkj.${pkjFieldName}.filePath) || './${configFileName}';
const configs = require_cwd(configFilePath);
${configurationPath ? `const customConfig = require('${configurationPath}')` : ''}

const { build } = configs || {};
const { configuration = config => config } = build || {};

${
  multiOutput
    ? `const entriesPath = '${srcDir}';
const entriesList = getFolders(entriesPath);

function getFolders (folderPath) {
  const list = fs.readdirSync(folderPath)
  const folderList = list.filter((v, k) => {
    const stats = fs.statSync(\`\${folderPath}/\${v}\`);
    return stats.isDirectory();
  })
  return folderList;
}`
    : ''
}

let indexPath = '';
const exts = ['ts', 'tsx', 'js', 'jsx'];
for (let i = 0, len = exts.length; i < len; i++) {
  indexPath = path.resolve('${srcDir}', \`index.\${exts[i]}\`);
  if (fs.existsSync(indexPath)) break;
}
const entry = {
  index: indexPath
};

${
  multiOutput
    ? `entriesList.forEach(v => {
  if (v !== 'style' && v !== 'styles') {
    let entryPath = '';
    for (let i = 0, len = exts.length; i < len; i++) {
      entryPath = path.resolve('${srcDir}', \`\${v}/index.\${exts[i]}\`);
      if (fs.existsSync(entryPath)) break;
    }
    entry[v] = entryPath;
  }
})`
    : ''
}

const basicConfig = {
  entry,
  output: {
    filename: '${hashType ? `[name].[${hashType}:8].js` : '[name].js'}',
    path: '${outDir}'
  },
  mode: 'production'
};

module.exports = ${
  configurationPath
    ? 'merge(basicConfig, customConfig);'
    : 'configuration(basicConfig);'
}`;
}