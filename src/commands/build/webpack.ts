import path from 'path';

export default function (config: {
  ts: boolean;
  multi_output: boolean;
  src_dir: string;
  out_dir: string;
}) {
  const { multi_output, src_dir = path.resolve(__dirname, '../src/'), out_dir = path.resolve(__dirname, '../lib/') } = config;
  return `'use strict';

const fs = require('fs');
const path = require('path');
const omni_config = require(path.resolve(process.cwd(), 'omni.config.js'));

const { build } = omni_config || {};
const { configuration = config => config } = build || {};

${
  multi_output
    ? `const fs = require('fs');

const entriesPath = '${src_dir}';
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
    filename: '[name].js',
    path: '${out_dir}'
  },
  module: {
    rules: [
      {
        test: /\\.(js|jsx)$/,
        use: [
          {loader: 'babel-loader'}
        ]
      },
      {
        test: /\\.(ts|tsx)$/,
        use: [
          {loader: 'ts-loader'}
        ]
      },
      {
        test: /\\.css$/,
        use:  ['style-loader', 'css-loader']
      },
      {
        test: /\\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\\.(woff|woff2|eot|ttf|svg|jpg|png|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'assets/[name].[hash:8].[ext]'
            }
          }
        ]
      }
    ],
  },
  plugins: [],
  mode: 'production',
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".css", ".less", ".scss"]
  }
});`;
}