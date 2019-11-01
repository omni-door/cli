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
});`;
}
