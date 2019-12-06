export default function (config: {
  toolName: string;
}) {
  const { toolName } = config;

  return `export function ${toolName} () {}

export default ${toolName};`;
}