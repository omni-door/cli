export default function (config: {
  ts: boolean;
  componentName: string;
}) {
  const { ts, componentName } = config;

  return `import React, { PureComponent } from 'react';

${ts ? `export interface ${componentName}Props {};` : ''}

${ts ? `export interface ${componentName}States {};` : ''}

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

