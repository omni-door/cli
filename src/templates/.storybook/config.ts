export default function (config: {
  name: string;
}) {
  const { name } = config;

  return `import { addDecorator, configure } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import { addReadme } from 'storybook-readme';
import { withInfo } from '@storybook/addon-info';

addDecorator(withInfo);
addDecorator(addReadme);
setOptions({
  name: '${name}',
});

const req = require.context('../src/', true, /\.stories\.(tsx|jsx)$/);
function loadStories() {
  const keys = req.keys();
  keys.forEach(filename => req(filename));
};
configure(loadStories, module);`;
}
