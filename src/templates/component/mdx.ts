export default function (config: {
  componentName: string;
}) {
  const { componentName } = config;

  return `---
name: ${componentName}
route: /${componentName}
---
import { Playground, Props } from 'docz'
import ${componentName} from './'

# ${componentName} 组件

<Props of={${componentName}} />

## Demo

<Playground>

  <${componentName} />

</Playground>`;
}