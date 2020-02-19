import { BUILD, DEVSERVER, PROJECT_TYPE } from '../../index.d';

export default function (config: {
  build: BUILD;
  devServer: DEVSERVER;
  project_type: PROJECT_TYPE;
  ts: boolean;
}) {
  const { build, devServer, project_type, ts } = config;
  const initText = `It's Your ${ project_type === 'toolkit' ? 'Omni-Toolkit' : 'Omni'} Project`;
  const needCoreJS = (project_type === 'spa-react' || project_type === 'component-library-react') && (build === 'webpack' || build === 'rollup');

  return `${ts ? '///<reference types=\'webpack-env\' />\n' : ''}${needCoreJS ? `
import 'core-js/stable';
import 'regenerator-runtime/runtime';
` : ''}
import React from 'react';
import { render } from 'react-dom';

const App = () => (
  <div className='main'>
    ${initText}
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