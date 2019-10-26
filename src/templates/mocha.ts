export default function (config: {
  ts: boolean;
}) {
  const { ts } = config;

  return `# mocha.opts
--require ts-node/register src/**/__test__/*.${ts ? 'ts' : 'js'}
--reporter spec`;
}


