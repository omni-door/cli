export default function (config: {
  name: string;
  git: string;
}) {
  const { name, git } = config;
  return `'use strict';

const path = require('path');

module.exports = {
  port: 6200,
  root: '/bisheng/',
  theme: 'bisheng-theme-one',
  themeConfig: {
    home: '/',
    sitename: '${name}',
    tagline: 'THE OMNI PROJECT',
    github: '${git}',
  }
};`;
}

