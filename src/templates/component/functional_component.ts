import { STYLE } from './../../index.d';

export default function (config: {
  ts: boolean;
  componentName: string;
  style: STYLE;
}) {
  const { ts, componentName, style } = config;

  return `import React${ts ? ', { FC }' : ''} from 'react';
${style ? `import './style/${componentName}.${style === 'all' ? 'less' : style}';` : ''}

${ts ? `export interface ${componentName}Props {}` : ''}

export const ${componentName}${ts ? `: FC<${componentName}Props>` : ''} = props => {
  const { children } = props;

  return (
    <div
      className='${componentName}'
    >
      { children }
    </div>
  );
};

export default ${componentName};`;
}

