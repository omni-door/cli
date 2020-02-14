export default function (config: {
  componentName: string;
}) {
  const { componentName } = config;

  return `import * as React from 'react';
import { storiesOf } from '@storybook/react';
import ${componentName} from '../index';

storiesOf('${componentName}', module)
  .addParameters({
    readme: {
      sidebar: require('../README.md').default,
      highlightSidebar: true,
      codeTheme: 'github'
    },
  })
  .add('with text', () => <${componentName}>Hello ${componentName}</${componentName}>);
`;
}