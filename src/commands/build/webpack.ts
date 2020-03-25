import path from 'path';
import { HASH } from '@omni-door/tpl-utils';

export default function (config: {
  ts: boolean;
  multiOutput: boolean;
  srcDir: string;
  outDir: string;
  configurationPath?: string;
  configFileName?: string;
  hash?: boolean | HASH;
}) {
  const { multiOutput, srcDir = path.resolve(__dirname, '../src/'), outDir = path.resolve(__dirname, '../lib/'), configurationPath, configFileName = 'omni.config.js', hash } = config;
  const hashType = 
    typeof hash === 'string'
      ? hash
      : hash
        ? 'contenthash'
        : hash;

  return `'use strict';

const fs = require('fs');
const path = require('path');
const merge = require('webpack-merge');

const configs = require(path.resolve(process.cwd(), '${configFileName}'));
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