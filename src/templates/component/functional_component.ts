import { STYLE } from './../../index.d';

export default function (config: {
  ts: boolean;
  componentName: string;
  style: STYLE;
}) {
  const { ts, componentName, style } = config;

  return `import React${ts ? ', { SFC }' : ''} from 'react';
${style ? `import './style/${componentName}.${style}';` : ''}

${ts ? `export interface ${componentName}Props {};` : ''}

const ${componentName}${ts ? `: SFC<${componentName}Props>` : ''} = props => {
  return (
    <div>
      { children }
    </div>
  );
};

export default ${componentName};`;
}

