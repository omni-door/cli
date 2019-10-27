export default function () {
  return `import React from 'react';
import { render } from 'react-dom';

const App = () => (
  <div className='main'>
    It's Your Omni Project
  </div>
)
render(<App />, document.getElementById('root'));`;
}