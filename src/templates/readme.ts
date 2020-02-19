export default function (config: {
  name: string;
  configFileName: string;
}) {
  const { name, configFileName } = config;

  return `# ${name}

## Run your project

\`\`\`sh
npm start
\`\`\`
or
\`\`\`sh
npm run dev
\`\`\`

## Create a Component by the Template

### Class Component
\`\`\`sh
npm run new [componentName]
\`\`\`

### Functional Component
\`\`\`sh
npm run new [componentName] -- -f
\`\`\`

## Build your project

\`\`\`sh
npm run build
\`\`\`

### Ignore pre-check
\`\`\`sh
npm run build -- -n
\`\`\`

## Release your project

\`\`\`sh
npm run release
\`\`\`

### Ignore automatic iteration of version
\`\`\`sh
npm run release -- -i
\`\`\`

### Manual iteration of version
\`\`\`sh
npm run release -- -m 0.3.25
\`\`\`

### Ignore pre-check
\`\`\`sh
npm run release -- -n
\`\`\`

**More powerful customizations is in [${configFileName}]**
`;
}

