export default function (config: {
  ts: boolean;
}) {
  const { ts } = config;

  return `'use strict';

module.exports = function (api) {
  api.cache(true);
  const presets = ['@babel/preset-env', '@babel/preset-react', '${ts ? '@babel/preset-typescript' : ''}'];

  const plugins = [];

  return {
    presets,
    plugins
  };
};`;
}