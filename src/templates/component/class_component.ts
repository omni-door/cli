import { STYLE } from './../../index.d';

export default function (config: {
  ts: boolean;
  componentName: string;
  style: STYLE;
}) {
  const { ts, componentName, style } = config;

  return `import React, { PureComponent } from 'react';
${style ? `import './style/${componentName}.${style}';` : ''}

${ts ? `export interface ${componentName}Props {};

export interface ${componentName}States {};` : ''}

class ${componentName} extends PureComponent${ts ? `<${componentName}Props, ${componentName}States>` : ''} {
  render() {
    const { children } = this.props;

    return (
      <div
        className='${componentName}'
      >
        { children }
      </div>
    );
  };
};

export default ${componentName};`;
}

