import program from 'commander';
import fs from 'fs';
import path from 'path';
import { initial, dev, newTpl, build, release } from './commands';
import { OmniConfig } from '../index.d';
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
  .option('-s, --simple [name]', 'create a simple React SPA project')
  .option('-d, --standard [name]', 'create a standard  React SPA project')
  .option('-e, --entire [name]', 'create a most versatile  React SPA project')
  .option('-t, --toolkit [name]', 'create a toolkit project')
  .option('-c, --components [name]', 'create a React component library')
  .description('initialize your project, [strategy] could be stable(default) or latest', {
    strategy: 'stable or latest',
  })
  .usage('[strategy] [options]')
  .action((strategy, options) => initial(strategy, options));

program
  .command('dev [port]')
  .description('omni dev [port]', {
    port: 'optional! The dev-server run port.',
  })
  .usage('[port] [options]')
  .action((port) => dev(config, port));

program
  .command('new <module>')
  .option('-fc, --function', 'create a functional component')
  .option('-cc, --class', 'create a class component')
  .description('omni new <module> [-fc | -cc]', {
    module: 'required! The first letter will be capitalizing.',
  })
  .usage('<module> [options]')
  .action((componentName, options) => newTpl(config, componentName, options));

program
  .command('build')
  .option('-n, --no-verify', 'bypass all pre-check before building')
  .description('build your project according to [omni.config.js]')
  .action((buildTactic) => build(config, buildTactic));

program
  .command('release')
  .option('-i, --ignore', 'ignore automatic iteration version')
  .option('-m, --manual <version>', 'manual iteration version')
  .option('-n, --no-verify', 'bypass all pre-check before release')
  .description('publish your project according to [omni.config.js]')
  .action((iterTactic) => release(config, iterTactic));

program.parse(process.argv);

if (!program.args.length) {
  program.help();
}