import program from 'commander';
import leven from 'leven';
import chalk from 'chalk';
import { node_version, npm_version, logWarn, require_cwd, logEmph } from '@omni-door/utils';
/* import types */
import type { OmniConfig } from '../index.d';

const commandDicts = {
  init: 'init',
  dev: 'dev',
  start: 'start',
  new: 'new',
  build: 'build',
  release: 'release'
};

(async function () {
  try {
    await node_version('10.13.0');
  } catch (e) {
    logWarn(e);
  }

  let isSlient = true;
  const args = process.argv.slice(2);
  if (args && args.length > 0 && args[0] !== 'init') {
    isSlient = !~Object.keys(commandDicts).indexOf(args[0]);
  }

  const { initial, dev, start, newTpl, build, release } = require('./commands');
  const pkj = require('../../package.json');
  let config: OmniConfig | null = null;
  let configFilePath = './omni.config.js';
  getConfig();

  // npm-package latest version checking
  npm_version(pkj.name || '@omni-door/cli', pkj.version);

  function getConfig () {
    try {
      const ppkj = require_cwd('./package.json', true);
      configFilePath = ppkj?.omni?.filePath || configFilePath;
      config = require_cwd(configFilePath, isSlient);
    } catch (e) {
      logWarn(e);
    }
  }

  function checkConfig () {
    if (!config) {
      logWarn(`请先初始化项目或检查「${configFilePath}」配置文件是否存在问题！(Please initialize project first or checking is there a problem with the「${configFilePath}」config file!)`);
      process.exit(0);
    }
  }

  function changeCWD (workPath: string) {
    try {
      process.chdir(workPath);
      const cwd = process.cwd();
      logEmph(`工作路径更新为「${cwd}」(The work path change to 「${cwd}」)`);
    } catch (err) {
      logWarn(`工作路径更新失败，请检查「${workPath}」是否存在！(Please checking the「${workPath}」had existed!)`);
      process.exit(0);
    }
  }

  program
    .version(pkj.version, '-v, --version')
    .name('omni')
    .usage('[command] [options]');

  program
    .command(`${commandDicts.init} [strategy]`)
    .option('-rb, --react_basic [name]', 'create a basic React SPA project')
    .option('-rs, --react_standard [name]', 'create a standard React SPA project')
    .option('-re, --react_entire [name]', 'create a most versatile React SPA project')
    .option('-rS, --react_ssr [name]', 'create a React component library')
    .option('-rc, --react_components [name]', 'create a React component library')
    .option('-t, --toolkit [name]', 'create a toolkit project')
    .option('-n, --no-install', 'init project without install dependencies')
    .option('-P, --path <path>', 'the workpath for init the project')
    .description('initialize your project, [strategy] could be stable(default) or latest', {
      strategy: 'stable or latest',
    })
    .usage('[strategy] [options]')
    .action((strategy, options) => {
      const workPath = options.path;
      if (workPath) {
        changeCWD(workPath);
      }

      const tplPkjTag = pkj?.version?.match(/[0-9]\.[0-9]/g)?.[0];
      initial(strategy, options, { tplPkjTag: tplPkjTag ? `~${tplPkjTag}` : 'latest' });
    });

  program
    .command(commandDicts.dev)
    .option('-p, --port <port>', 'start the dev-server according to the specified port')
    .option('-H, --hostname <host>', 'start the dev-server according to the specified hostname')
    .option('-P, --path <path>', 'the workpath for start the dev-server')
    .description('omni dev [-p <port>] [-H <host>] [-P <path>]', {
      port: 'The dev-server listen port.',
      host: 'The dev-server running hostname.',
      path: 'The cli workpath for running dev-server.'
    })
    .action((options) => {
      const workPath = options.path;
      if (workPath) {
        changeCWD(workPath);
        getConfig();
      }

      checkConfig();
      dev(config, options);
    });

  program
    .command(commandDicts.start)
    .option('-p, --port <port>', 'start the prod-server according to the specified port')
    .option('-H, --hostname <host>', 'start the prod-server according to the specified hostname')
    .option('-P, --path <path>', 'the workpath for start the prod-server')
    .description('omni start [-p <port>] [-H <host>] [-P <path>]', {
      port: 'The prod-server listen port.',
      host: 'The prod-server running hostname.',
      path: 'The cli workpath for running prod-server.'
    })
    .action((options) => {
      const workPath = options.path;
      if (workPath) {
        changeCWD(workPath);
        getConfig();
      }

      checkConfig();
      start(config, options);
    });

  program
    .command(`${commandDicts.new} [name]`)
    .option('-f, --function', 'create a functional component')
    .option('-c, --class', 'create a class component')
    .option('-P, --path <path>', 'the workpath for create component')
    .description('omni new [name] [-f | -c] [-P <path>]', {
      name: 'The name of component.',
    })
    .usage('[name] [options]')
    .action((componentName, options) => {
      const workPath = options.path;
      if (workPath) {
        changeCWD(workPath);
        getConfig();
      }

      checkConfig();
      newTpl(config, componentName, options);
    });

  program
    .command(commandDicts.build)
    .option('-c, --config <path>', 'specify the path of config file')
    .option('-n, --no-verify', 'bypass all pre-check before building')
    .option('-P, --path <path>', 'the workpath for build project')
    .description('build your project according to the [omni.config.js]\'s build field')
    .action((buildTactic) => {
      const workPath = buildTactic.path;
      if (workPath) {
        changeCWD(workPath);
        getConfig();
      }

      checkConfig();
      build(config, buildTactic);
    });

  program
    .command(commandDicts.release)
    .option('-a, --automatic', 'auto-increase the version of iteration')
    .option('-i, --ignore', 'ignoring the version of iteration')
    .option('-m, --manual <version>', 'manual specify the version of iteration')
    .option('-t, --tag <tag>', 'the tag will add to npm-package')
    .option('-n, --no-verify', 'bypass all pre-check before release')
    .option('-P, --path <path>', 'the workpath for release project')
    .description('publish your project according to the [omni.config.js]\'s release field')
    .action((iterTactic) => {
      const workPath = iterTactic.path;
      if (workPath) {
        changeCWD(workPath);
        getConfig();
      }

      checkConfig();
      release(config, iterTactic);
    });

  program.arguments('<command>')
    .action(unknownCommand => {
      const availableCommands = program.commands.map(cmd => cmd._name);

      let suggestion: any;
    
      availableCommands.forEach(cmd => {
        const isBestMatch =
          leven(cmd, unknownCommand) < leven(suggestion || '', unknownCommand);
        if (leven(cmd, unknownCommand) < 3 && isBestMatch) {
          suggestion = cmd;
        }
      });
    
      logWarn(`Unknown command ${chalk.red(unknownCommand)}!`);
      if (suggestion) {
        logWarn(`Did you mean ${chalk.green(suggestion)}?`);
      }
    });

  program.parse(process.argv);
  if (!program.args.length) {
    program.help();
  }
})();
