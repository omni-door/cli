export default function () {
  return `
'use strict';

const path = require('path');

module.exports = {
  source: path.resolve('src'),
  output: path.resolve('.site'),
  theme: path.resolve('.theme'),
  port: 6200,
};
`;
}

