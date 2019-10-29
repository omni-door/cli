import path from 'path';
import { ANYOBJECT } from '../../index.d';

export default function (config: {
  ts: boolean;
  multi_output: boolean;
  src_dir: string;
  out_dir: string;
  custom_exports?: ANYOBJECT;
}) {
  const { ts, multi_output, src_dir = path.resolve(__dirname, '../src/'), out_dir = path.resolve(__dirname, '../lib/'), custom_exports } = config;

  return `'use strict';

const path = require('path');
${
  multi_output
    ? `const fs = require('fs');

    const entriesPath = ${src_dir};
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

const entry = {
  index: path.resolve(${src_dir}, 'index.${ts ? 'ts' : 'js'}')
};

${
  multi_output
    ? `entriesList.forEach(v => {
      if (v !== 'style' && v !== 'styles') {
        entry[v] = path.resolve(${src_dir}, \`\${v}/index.${ts ? 'ts' : 'js'}\`)
      }
    })`
    : ''
}

module.exports = ${
  custom_exports
    ? custom_exports
    : `{
      entry,
      output: {
        filename: '[name].js',
        path: ${out_dir}
      },
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            include: ${src_dir},
            exclude: /node_modules/,
            use: [
              {loader: 'babel-loader'}
            ]
          },
          {
            test: /\.(ts|tsx)$/,
            include: ${src_dir},
            exclude: /node_modules/,
            use: [
              {
                loader: 'ts-loader'
              }
            ]
          },
          {
            test: /\.css$/,
            use:  ['style-loader', 'css-loader'],
            include: ${src_dir}
          },
          {
            test: /\.scss$/,
            use: ['style-loader', 'css-loader', 'sass-loader'],
            include: ${src_dir}
          },
          {
            test: /\.less$/,
            use: ['style-loader', 'css-loader', 'less-loader'],
            include: ${src_dir}
          }
        ],
      },
      plugins: [],
      mode: 'production',
      resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".css", ".less", ".scss"]
      }
    };`
}
`;
}