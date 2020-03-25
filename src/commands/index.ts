import program from 'commander';
import fs from 'fs';
import path from 'path';
import { node_version, logWarn } from '@omni-door/tpl-utils';
import { OmniConfig } from '../index.d';

(async function () {
  try {
    await node_version('10.13.0');
  } catch (e) {
    logWarn(e);
  }

  const { initial, dev, newTpl, build, release } = require('./commands');
  const pkj = require('../../package.json');
  let config: OmniConfig | {} = {};
  if (fs.existsSync(path.resolve('omni.config.js'))) {
    config = require(path.resolve('omni.config.js'));
  }

  program
    .version(pkj.version, '-v, --version')
    .name('omni')
    .usage('[command] [options]');

  program
    .command('init [strategy]')
    .option('-b, --basic [name]', 'create a basic React SPA project')
    .option('-s, --standard [name]', 'create a standard  React SPA project')
    .option('-e, --entire [name]', 'create a most versatile  React SPA project')
    .option('-t, --toolkit [name]', 'create a toolkit project')
    .option('-c, --components [name]', 'create a React component library')
    .description('initialize your project, [strategy] could be stable(default) or latest', {
      strategy: 'stable or latest',
    })
    .usage('[strategy] [options]')
    .action((strategy, options) => initial(strategy, options));

  program
    .command('dev')
    .option('-p, --port [port]', 'start the dev-server according to the specified port')
    .description('omni dev -p [port]', {
      port: 'optional! The dev-server run port.',
    })
    .action((options) => dev(config, options));

  program
    .command('new <module>')
    .option('-f, --function', 'create a functional component')
    .option('-c, --class', 'create a class component')
    .description('omni new <module> [-f | -c]', {
      module: 'required! The first letter will be capitalizing.',
    })
    .usage('<module> [options]')
    .action((componentName, options) => newTpl(config, componentName, options));

  program
    .command('build')
    .option('-c, --config <path>', 'specify the path of config file')
    .option('-n, --no-verify', 'bypass all pre-check before building')
    .description('build your project according to [omni.config.js]')
    .action((buildTactic) => build(config, buildTactic));

  program
    .command('release')
    .option('-i, --ignore', 'ignore automatic iteration version')
    .option('-m, --manual <version>', 'manual iteration version')
    .option('-t, --tag <tag>', 'the tag will add to npm-package')
    .option('-n, --no-verify', 'bypass all pre-check before release')
    .description('publish your project according to [omni.config.js]')
    .action((iterTactic) => release(config, iterTactic));

  program.parse(process.argv);

  if (!program.args.length) {
    program.help();
  }
})();
