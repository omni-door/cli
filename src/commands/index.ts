import program from 'commander';
import fs from 'fs';
import path from 'path';
import { node_version, logWarn } from '@omni-door/utils';
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
  try {
    const cwd = process.cwd();

    let ppkj;
    const ppkjPath = path.resolve(cwd, 'package.json');
    if (fs.existsSync(ppkjPath)) ppkj = require(ppkjPath);

    const configFilePath = path.resolve(cwd, (ppkj && ppkj.omni && ppkj.omni.filePath) || 'omni.config.js');
    if (fs.existsSync(configFilePath)) config = require(configFilePath);
  } catch (e) {
    logWarn(e);
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
    .option('-n, --no-install', 'init project without install dependencies')
    .description('initialize your project, [strategy] could be stable(default) or latest', {
      strategy: 'stable or latest',
    })
    .usage('[strategy] [options]')
    .action((strategy, options) => initial(strategy, options));

  program
    .command('dev')
    .option('-p, --port <port>', 'start the dev-server according to the specified port')
    .description('omni dev -p <port>', {
      port: 'required! The dev-server run port.',
    })
    .action((options) => dev(config, options));

  program
    .command('new [name]')
    .option('-f, --function', 'create a functional component')
    .option('-c, --class', 'create a class component')
    .description('omni new [name] [-f | -c]', {
      name: 'optional! The name of component.',
    })
    .usage('[name] [options]')
    .action((componentName, options) => newTpl(config, componentName, options));

  program
    .command('build')
    .option('-c, --config <path>', 'specify the path of config file')
    .option('-n, --no-verify', 'bypass all pre-check before building')
    .description('build your project according to [omni.config.js]')
    .action((buildTactic) => build(config, buildTactic));

  program
    .command('release')
    .option('-a, --automatic', 'auto-increase the version of iteration')
    .option('-i, --ignore', 'ignoring the version of iteration')
    .option('-m, --manual <version>', 'manual specify the version of iteration')
    .option('-t, --tag <tag>', 'the tag will add to npm-package')
    .option('-n, --no-verify', 'bypass all pre-check before release')
    .description('publish your project according to [omni.config.js]')
    .action((iterTactic) => release(config, iterTactic));

  program.parse(process.argv);
  if (!program.args.length) {
    program.help();
  }
})();
