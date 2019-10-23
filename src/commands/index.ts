import program from 'commander';
import fs from 'fs';
import path from 'path';
// const build = require('./build');
import initial from './initial';
// const release = require('./release');
// const template = require('./template');

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
  .description('initialize your project')
  .action(initial);

program
  .command('new')
  .description('omni new [name] [-t|--type]')
  .action(initial);

program
  .command('build')
  .description('build your project according to [omni.config.js]')
  .action(initial);

program
  .command('release')
  .description('publish your project according to [omni.config.js]')
  .action(initial);

program.parse(process.argv);
if (!program.args[0]) {
  program.help();
}