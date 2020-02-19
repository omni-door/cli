import { PROJECT_TYPE } from '../index.d';

export default function (config: {
  project_type: PROJECT_TYPE;
  ts: boolean;
}) {
  const { project_type, ts } = config;
  const isReactSPAProject = project_type === 'spa-react';

  return `'use strict';

module.exports = function (api) {
  api.cache(false);
  const presets = [
    ${isReactSPAProject ? '[\'@babel/preset-env\', { useBuiltIns: \'entry\',corejs: 3 }]' : '\'@babel/preset-env\''},
    '@babel/preset-react'${ts ? `,
    '@babel/preset-typescript'` : ''}
  ];

  const plugins = [];

  return {
    presets,
    plugins
  };
};`;
}