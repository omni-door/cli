import program from 'commander';
import leven from 'leven';
import chalk from 'chalk';
import { nodeVersionCheck, npmVersionCheck, updateNotifier, logErr, logWarn, requireCwd, logInfo } from '@omni-door/utils';
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

function splitPassThroughArgs (argv: string[]) {
  const splitIndex = argv.indexOf('--');
  if (splitIndex === -1) {
    return { passThroughArgs: [], parsedArgv: argv };
  }

  return {
    passThroughArgs: argv.slice(splitIndex + 1),
    parsedArgv: argv.slice(0, splitIndex)
  };
}

(async function () {
  try {
    await nodeVersionCheck('10.13.0');
  } catch (e) {
    logWarn(e as string);
  }

  const { initial, dev, start, newTpl, build, release } = require('./commands');
  const pkj = require('../../package.json');
  let config: OmniConfig | null = null;
  let configFilePath = './omni.config.js';

  function getConfig (silent?: boolean) {
    try {
      const ppkj = requireCwd('./package.json', true);
      configFilePath = ppkj?.omni?.filePath || configFilePath;
      config = requireCwd(configFilePath, silent);
    } catch (e) {
      logWarn(e as string);
    }
  }

  function checkConfig () {
    if (!config) {
      logWarn(`Please initialize project first or checking the "${configFilePath}" configuration file`);
      process.exit(0);
    }
  }

  function changeCWD (workPath: string) {
    try {
      process.chdir(workPath);
      const cwd = process.cwd();
      logInfo(`The work path change to "${cwd}"`);
    } catch (err) {
      logWarn(`Please check that "${workPath}" exists`);
      process.exit(0);
    }
  }

  const { passThroughArgs, parsedArgv } = splitPassThroughArgs(process.argv);

  program
    .version(pkj.version, '-v, --version')
    .name('omni')
    .usage('[command] [options]');

  program
    .command(`${commandDicts.init} [strategy]`)
    .option('-rb, --react_basic [name]', 'create a basic React SPA project')
    .option('-rs, --react_standard [name]', 'create a standard React SPA project')
    .option('-re, --react_entire [name]', 'create a most versatile React SPA project')
    .option('-rp, --react_pc [name]', 'create a React SPA project based on antd')
    .option('-vb, --vue_basic [name]', 'create a basic Vue SPA project')
    .option('-vs, --vue_standard [name]', 'create a standard Vue SPA project')
    .option('-ve, --vue_entire [name]', 'create a most versatile Vue SPA project')
    .option('-rS, --react_ssr [name]', 'create a React component library')
    .option('-rc, --react_components [name]', 'create a React component library')
    .option('-vc, --vue_components [name]', 'create a Vue component library')
    .option('-t, --toolkit [name]', 'create a toolkit project')
    .option('-n, --no-install', 'init project without install dependencies')
    .option('-P, --path <path>', 'the workpath for init the project')
    .description('initialize your project, [strategy] could be stable(default) or latest', {
      strategy: 'stable or latest',
    })
    .usage('[strategy] [options]')
    .action((strategy, options) => {
      updateNotifier(pkj);

      const workPath = options.path;
      if (workPath) changeCWD(workPath);

      const CLITAG = pkj?.version?.match?.(/[a-zA-Z]+/g)?.[0];
      const TPLTAG = pkj?.version?.match?.(/[0-9]+\.[0-9]+/g)?.[0];
      const CLICURRENTVERSION = pkj?.version?.match?.(/[0-9]+\.[0-9]+\.[0-9]+/g)?.[0];

      initial(strategy, options, { tplPkjTag: TPLTAG ? `~${TPLTAG}` : 'latest', tplPkjParams: [ `tag=${CLITAG || (CLICURRENTVERSION ? `~${CLICURRENTVERSION}` : 'latest')}` ] });
    });

  program
    .command(commandDicts.dev)
    .option('-p, --port <port>', 'start the dev-server according to the specified port')
    .option('-H, --hostname <host>', 'start the dev-server according to the specified hostname')
    .option('-P, --path <path>', 'the workpath for start the dev-server')
    .description('omni dev [-p <port>] [-H <host>] [-P <path>] [-- <args>]', {
      port: 'The dev-server listen port.',
      host: 'The dev-server running hostname.',
      path: 'The cli workpath for running dev-server.',
      args: 'Pass extra args to underlying dev command (e.g. omni dev -- --webpack).'
    })
    .action((options) => {
      const workPath = options.path;
      if (workPath) changeCWD(workPath);

      getConfig(!!workPath);
      checkConfig();
      npmVersionCheck(pkj.name, pkj.version);

      dev(config, { ...options, passThroughArgs });
    });

  program
    .command(commandDicts.start)
    .option('-p, --port <port>', 'start the prod-server according to the specified port')
    .option('-H, --hostname <host>', 'start the prod-server according to the specified hostname')
    .option('-P, --path <path>', 'the workpath for start the prod-server')
    .description('omni start [-p <port>] [-H <host>] [-P <path>] [-- <args>]', {
      port: 'The prod-server listen port.',
      host: 'The prod-server running hostname.',
      path: 'The cli workpath for running prod-server.',
      args: 'Pass extra args to underlying start command (e.g. omni start -- --hostname 0.0.0.0).'
    })
    .action((options) => {
      const workPath = options.path;
      if (workPath) changeCWD(workPath);

      getConfig(!!workPath);
      checkConfig();

      start(config, { ...options, passThroughArgs });
    });

  program
    .command(`${commandDicts.new} [name]`)
    .option('-f, --function', 'create a React-Function-Component')
    .option('-c, --class', 'create a React-Class-Component')
    .option('-r, --render', 'create a Vue-Render-Function')
    .option('-s, --single', 'create a Vue-Single-File-Component')
    .option('-P, --path <path>', 'the workpath for create component')
    .description('omni new [name] [-f | -c] [-P <path>]', {
      name: 'The name of component.',
    })
    .usage('[name] [options]')
    .action((componentName, options) => {
      const workPath = options.path;
      if (workPath) changeCWD(workPath);

      getConfig(!!workPath);
      checkConfig();
      updateNotifier(pkj);
      const TPLTAG = pkj?.version?.match?.(/[0-9]\.[0-9]/g)?.[0];
      newTpl(config, componentName, { ...options, tplPkjTag: TPLTAG });
    });

  program
    .command(commandDicts.build)
    .option('-c, --config <path>', 'specify the path of config file')
    .option('-n, --no-verify', 'bypass all pre-check before building')
    .option('-P, --path <path>', 'the workpath for build project')
    .description('build your project according to the [omni.config.js]\'s build field. Use -- <args> to pass extra args (e.g. omni build -- --webpack).')
    .action((buildTactic) => {
      const workPath = buildTactic.path;
      if (workPath) changeCWD(workPath);

      getConfig(!!workPath);
      checkConfig();
      npmVersionCheck(pkj.name, pkj.version);

      build(config, { ...buildTactic, passThroughArgs });
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
      if (workPath) changeCWD(workPath);

      getConfig(!!workPath);
      checkConfig();
      updateNotifier(pkj);

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
    
      logErr(`Unknown command ${chalk.bold(`omni ${unknownCommand}`)}`);
      if (suggestion) {
        logWarn(`Try to ${chalk.underline(chalk.green(`omni ${suggestion}`))}`);
      }
    });

  program.parse(parsedArgv);
  if (!program.args.length) {
    program.help();
  }
})();
