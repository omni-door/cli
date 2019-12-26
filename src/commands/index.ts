import program from 'commander';
import fs from 'fs';
import path from 'path';
import { initial, newTpl, build, release } from './commands';
import { OmniConfig } from '../index.d';
const pkj = require('../../package.json');

let config: OmniConfig | {} = {};
if (fs.existsSync(path.resolve('omni.config.js'))) {
  config = require(path.resolve('omni.config.js'));
}

program.version(pkj.version, '-v, --version');

program
  .command('init')
  .option('-s, --simple [name]', 'create a simple React SPA project')
  .option('-d, --standard [name]', 'create a standard  React SPA project')
  .option('-e, --entire [name]', 'create a most versatile  React SPA project')
  .option('-t, --toolkit [name]', 'create a toolkit project')
  .option('-c, --components [name]', 'create a React component library')
  .description('initialize your project')
  .action(initial);

program
  .command('new <module>')
  .option('-f, --fc', 'create a functional component')
  .option('-c, --cc', 'create a class component')
  .description('omni new <module> [-f | -c]')
  .action((componentName, options) => newTpl(config, componentName, options));

program
  .command('build')
  .description('build your project according to [omni.config.js]')
  .action(() => build(config));

program
  .command('release')
  .option('-i, --ignore', 'ignore automatic iteration version')
  .option('-m, --manual <version>', 'manual iteration version')
  .option('-n, --no-verify', 'bypass unit-test eslint and stylelint check')
  .description('publish your project according to [omni.config.js]')
  .action((iterTactic) => release(config, iterTactic));

program.parse(process.argv);
if (!program.args[0]) {
  program.help();
}