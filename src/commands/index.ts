import program from 'commander';
import fs from 'fs';
import path from 'path';
import initial from './initial';
import newTpl from './new';
import build from './build';
import release from './release';
import { OmniConfig } from '../index.d';
const pkj = require('../../package.json');

let config: OmniConfig | {} = {};
if (fs.existsSync(path.resolve('omni.config.js'))) {
  config = require(path.resolve('omni.config.js'));
}

program.version(pkj.version, '-v, --version');

program
  .command('init')
  .option('-s --simple', 'create a simple project')
  .option('-t --standard', 'create a standard project')
  .option('-e --entire', 'create a most versatile project')
  .option('-u --utils', 'create a utils library')
  .option('-c --components', 'create a component library')
  .description('initialize your project')
  .action(initial);

program
  .command('new [module]')
  .option('-f, --fc', 'create a functional component')
  .option('-c, --cc', 'create a class component')
  .description('omni new [module] [-f | -c]')
  .action((componentName, options) => newTpl(config, componentName, options));

program
  .command('build')
  .description('build your project according to [omni.config.js]')
  .action(() => build(config));

program
  .command('release')
  .option('-i, --ignore', 'ignore automatic iteration version')
  .option('-m, --manual <version>', 'manual iteration version')
  .description('publish your project according to [omni.config.js]')
  .action((iterTactic) => release(config, iterTactic));

program.parse(process.argv);
if (!program.args[0]) {
  program.help();
}