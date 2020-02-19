import path from 'path';

export default function (config: {
  ts: boolean;
  multi_output: boolean;
  src_dir: string;
  out_dir: string;
  configFileName?: string;
  hash?: boolean;
}) {
  const { multi_output, src_dir = path.resolve(__dirname, '../src/'), out_dir = path.resolve(__dirname, '../lib/'), configFileName = 'omni.config.js', hash } = config;
  return `'use strict';

const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const configs = require(path.resolve(process.cwd(), '${configFileName}'));
const htmlPath = path.join('${src_dir}', 'index.html');
const isExistHtml = fs.existsSync(htmlPath);
const htmlWebpackPlugin = isExistHtml && new HtmlWebpackPlugin({
  path: path.resolve('${out_dir}'),
  template: path.join('${src_dir}', 'index.html'),
  minify:{
    removeComments: true,
    collapseWhitespace: true
  },
  filename: '${hash ? 'index.[hash:8].html' : 'index.html'}'
});
const { build } = configs || {};
const { configuration = config => config } = build || {};

${
  multi_output
    ? `const entriesPath = '${src_dir}';
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
  indexPath = path.resolve('${src_dir}', \`index.\${exts[i]}\`);
  if (fs.existsSync(indexPath)) break;
}
const entry = {
  index: indexPath
};

${
  multi_output
    ? `entriesList.forEach(v => {
  if (v !== 'style' && v !== 'styles') {
    let entryPath = '';
    for (let i = 0, len = exts.length; i < len; i++) {
      entryPath = path.resolve('${src_dir}', \`\${v}/index.\${exts[i]}\`);
      if (fs.existsSync(entryPath)) break;
    }
    entry[v] = entryPath;
  }
})`
    : ''
}

module.exports = configuration({
  entry,
  output: {
    filename: '${hash ? '[name].[hash:8].js' : '[name].js'}',
    path: '${out_dir}'
  },
  plugins: [
    htmlWebpackPlugin ? htmlWebpackPlugin : null
  ],
  mode: 'production'
});`;
}