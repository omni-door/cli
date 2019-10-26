export default function (config: {
  componentName: string;
}) {
  const { componentName } = config;

  return `.${componentName} {
  display: block;
}`;
}