export default function (config: {
  name: string;
  configFileName: string;
}) {
  const { name, configFileName } = config;

  return `# ${name}

## Run Your Project

\`\`\`sh
npm start
\`\`\`
or
\`\`\`sh
npm run dev
\`\`\`

## Create a Component by Template

### Class Component
\`\`\`sh
npm run new [componentName]
\`\`\`

### Functional Component
\`\`\`sh
npm run new [componentName] -- -f
\`\`\`

## Build your Project

\`\`\`sh
npm run build
\`\`\`

### Ignore pre-check
\`\`\`sh
npm run build -- -n
\`\`\`

## Release your Project

\`\`\`sh
npm run release
\`\`\`

### Ignore automatic iteration version
\`\`\`sh
npm run release -- -i
\`\`\`

### manual iteration version
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

