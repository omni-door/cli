import program from 'commander';
import { node_version, logWarn, require_cwd } from '@omni-door/utils';
import { OmniConfig } from '../index.d';

(async function () {
  try {
    await node_version('10.13.0');
  } catch (e) {
    logWarn(e);
  }

  const { initial, dev, start, newTpl, build, release } = require('./commands');
  const pkj = require('../../package.json');
  let config: OmniConfig | {} = {};
  try {
    const ppkj = require_cwd('./package.json');
    const configFilePath = (ppkj && ppkj.omni && ppkj.omni.filePath) || './omni.config.js';
    config = require_cwd(configFilePath);
    if (!config) throw new Error(`请检查「${configFilePath}」配置文件！(Please checking 「${configFilePath}」config file!)`);
  } catch (e) {
    logWarn(e);
    process.exit(0);
  }

  program
    .version(pkj.version, '-v, --version')
    .name('omni')
    .usage('[command] [options]');

  program
    .command('init [strategy]')
    .option('-rb, --react_basic [name]', 'create a basic React SPA project')
    .option('-rs, --react_standard [name]', 'create a standard React SPA project')
    .option('-re, --react_entire [name]', 'create a most versatile React SPA project')
    .option('-rS, --react_ssr [name]', 'create a React component library')
    .option('-rc, --react_components [name]', 'create a React component library')
    .option('-t, --toolkit [name]', 'create a toolkit project')
    .option('-n, --no-install', 'init project without install dependencies')
    .description('initialize your project, [strategy] could be stable(default) or latest', {
      strategy: 'stable or latest',
    })
    .usage('[strategy] [options]')
    .action((strategy, options) => initial(strategy, options));

  program
    .command('dev')
    .option('-p, --port <port>', 'start the dev-server according to the specified port')
    .option('-H, --hostname <host>', 'start the dev-server according to the specified hostname')
    .description('omni dev -p <port> -H <host>', {
      port: 'The dev-server listen port.',
      host: 'The dev-server running hostname.'
    })
    .action((options) => dev(config, options));

  program
    .command('start')
    .option('-p, --port <port>', 'start the prod-server according to the specified port')
    .option('-H, --hostname <host>', 'start the node-server according to the specified hostname')
    .description('omni start -p <port> -H <host>', {
      port: 'The prod-server listen port.',
      host: 'The prod-server running hostname.'
    })
    .action((options) => start(config, options));

  program
    .command('new [name]')
    .option('-f, --function', 'create a functional component')
    .option('-c, --class', 'create a class component')
    .description('omni new [name] [-f | -c]', {
      name: 'The name of component.',
    })
    .usage('[name] [options]')
    .action((componentName, options) => newTpl(config, componentName, options));

  program
    .command('build')
    .option('-c, --config <path>', 'specify the path of config file')
    .option('-n, --no-verify', 'bypass all pre-check before building')
    .description('build your project according to [omni.config.js] build field')
    .action((buildTactic) => build(config, buildTactic));

  program
    .command('release')
    .option('-a, --automatic', 'auto-increase the version of iteration')
    .option('-i, --ignore', 'ignoring the version of iteration')
    .option('-m, --manual <version>', 'manual specify the version of iteration')
    .option('-t, --tag <tag>', 'the tag will add to npm-package')
    .option('-n, --no-verify', 'bypass all pre-check before release')
    .description('publish your project according to [omni.config.js] release field')
    .action((iterTactic) => release(config, iterTactic));

  program.parse(process.argv);
  if (!program.args.length) {
    program.help();
  }
})();
