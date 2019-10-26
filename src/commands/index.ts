import program from 'commander';
import fs from 'fs';
import path from 'path';
import initial from './initial';
import newTpl from './new';
// import build from './build';
// import release from './release';
// import test from './test';
// import lint from './lint';
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
  .action(params => newTpl(config, params));

program
  .command('build')
  .description('build your project according to [omni.config.js]')
  .action(initial);

program
  .command('release')
  .option('-i, --ignore', 'ignore automatic iteration version')
  .option('-m, --manual <version>', 'manual iteration version')
  .description('publish your project according to [omni.config.js]')
  .action(initial);

program
  .command('test')
  .option('--snapshot', 'update test snapshot')
  .description('test your project by unit test frame')
  .action(initial);

program
  .command('lint')
  .option('--commit', 'commitlint check')
  .option('--style', 'stylelint check')
  .option('--fix', 'eslint and stylelint fix')
  .description('check your project by lint-tools')
  .action(initial);

program.parse(process.argv);
if (!program.args[0]) {
  program.help();
}