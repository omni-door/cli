export default function (config: {
  ts: boolean;
}) {
  const { ts } = config;

  return `'use strict';

module.exports = function (api) {
  api.cache(false);
  const presets = ${
  ts
    ? '[\'@babel/preset-env\', \'@babel/preset-react\', \'@babel/preset-typescript\'];'
    : '[\'@babel/preset-env\', \'@babel/preset-react\'];'
}

  const plugins = [];

  return {
    presets,
    plugins
  };
};`;
}