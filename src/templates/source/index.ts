import { DEVSERVER } from '../../index.d';

export default function (config: {
  devServer: DEVSERVER;
}) {
  const { devServer } = config;

  return `import React from 'react';
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