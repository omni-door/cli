export default function (config: {
  componentName: string;
}) {
  const { componentName } = config;

  return `import * as React from 'react';
import { storiesOf } from '@storybook/react';
import ${componentName} from '../index';
import ${componentName}ReadMe from '../README.md';

storiesOf('${componentName}', module)
  .addParameters({
    readme: {
      sidebar: ${componentName}ReadMe,
      highlightSidebar: true,
      codeTheme: 'github'
    },
  })
  .add('with text', () => <${componentName}>Hello ${componentName}</${componentName}>);
`;
}