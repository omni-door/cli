export default function (config: {
  ts: boolean;
  componentName: string;
}) {
  const { ts, componentName } = config;

  return `import ${componentName} from './${componentName}';

export { ${componentName}${ts ? `, ${componentName}Props` : ''} } from './${componentName}';
export default ${componentName};`;
}