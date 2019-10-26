export default function (config: {
  componentName: string;
}) {
  const { componentName } = config;

  return `# ${componentName}

## Example

\`\`\`javascript
<${componentName} />
\`\`\``;
}

