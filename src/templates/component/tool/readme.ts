export default function (config: {
  toolName: string;
}) {
  const { toolName } = config;

  return `# ${toolName}

## Example

\`\`\`javascript
${toolName}()
\`\`\``;
}

