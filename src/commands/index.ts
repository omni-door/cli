import program from 'commander';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import initial from './initial';
// import new from './new';
// import build from './build';
// import release from './release';
// import test from './test';
// import lint from './lint';

let config = {};
if (fs.existsSync(path.resolve('omni.config.js'))) {
  config = require(path.resolve('omni.config.js'));
}

const pkg = fs.readFileSync(path.resolve('package.json'), 'utf-8');
const vmatch = pkg.match(/version.*(\d+).(\d+).(\d+)/);
const version = vmatch ? `${vmatch[1]}.${vmatch[2]}.${vmatch[3]}` : 'unknown';

program.version(version, '-v, --version');

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
  .option('-f, --sfc', 'create functional component')
  .option('-b, --business', 'create business module')
  .description('omni new [module] [-fc | -b]')
  .action(initial);

program
  .command('build')
  .option('-m, --mode <es|lib|umd>', 'build pattern')
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