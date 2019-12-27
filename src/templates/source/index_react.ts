import { BUILD, DEVSERVER, PROJECT_TYPE } from '../../index.d';

export default function (config: {
  build: BUILD;
  devServer: DEVSERVER;
  project_type: PROJECT_TYPE;
  ts: boolean;
}) {
  const { build, devServer, project_type, ts } = config;
  const needCoreJS = (project_type === 'spa_react' || project_type === 'component_library_react') && (build === 'webpack' || build === 'rollup');

  return `${ts ? '///<reference types=\'webpack-env\' />\n' : ''}${needCoreJS ? `
import 'core-js/stable';
import 'regenerator-runtime/runtime';
` : ''}
import React from 'react';
import { render } from 'react-dom';

const App = () => (
  <div className='main'>
    It's Your Omni Project
  </div>
);

render(<App />, document.getElementById('root'));
${
  devServer === 'basic'
    ? `if (module.hot) {
  module.hot.accept();
}`
    : ''
}`;
}