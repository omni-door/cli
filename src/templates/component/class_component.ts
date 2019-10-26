export default function (config: {
  ts: boolean;
  componentName: string;
}) {
  const { ts, componentName } = config;

  return `import React${ts ? ', { SFC }' : ''} from 'react';

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

