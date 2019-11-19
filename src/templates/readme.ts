export default function (config: {
  name: string;
}) {
  const { name } = config;

  return `# ${name}

## Run Your Project

\`\`\`sh
npm start
\`\`\`
or
\`\`\`sh
npm run dev
\`\`\`

## Create Component by Template

### Class Component
\`\`\`sh
npm run new [componentName]
\`\`\`

### Functional Component
\`\`\`sh
npm run new [componentName] -f
\`\`\`

## Build your Project

\`\`\`sh
npm run build
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

## More powerful customization is in [omni.config.js]
`;
}

