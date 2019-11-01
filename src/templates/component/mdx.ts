export default function (config: {
  ts: boolean;
  componentName: string;
}) {
  const { ts, componentName } = config;

  return `---
name: ${componentName}
route: /${componentName}
---
import { Playground, Props } from 'docz'
import ${componentName} from './index.${ts ? 'tsx' : 'jsx'}'

# ${componentName} 组件

<Props of={${componentName}} />

## Demo

<Playground>

  <${componentName} />

</Playground>`;
}