import fs from 'fs';
import path, { parse } from 'path';
import { promisify } from 'util';
import { execSync } from 'child_process';
import fsExtra from 'fs-extra';
import chalk from 'chalk';
import figlet from 'figlet';
import inquirer from 'inquirer';
import presetCli from './initial_preset';
import {
  spinner,
  exec,
  arr2str,
  logErr,
  logWarn,
  logInfo,
  getBrand,
  nodeVersionCheck,
  pkgNameCheck,
  getNpmVersions
} from '@omni-door/utils';
import { logo, signal } from '../../utils';
/* import types */
import type { PKJ_TOOL, STRATEGY } from '@omni-door/utils';

type OptionType = {
  react_basic?: boolean | string;
  react_standard?: boolean | string;
  react_entire?: boolean | string;
  react_pc?: boolean | string;
  vue_basic?: boolean | string;
  vue_standard?: boolean | string;
  vue_entire?: boolean | string;
  react_ssr?: boolean | string;
  react_components?: boolean | string;
  vue_components?: boolean | string;
  toolkit?: boolean | string;
  install: boolean;
};

type BeforeRes = {
  create_dir?: boolean;
  dir_name?: string;
  stdout?: boolean;
};

type AfterRes = {
  success?: boolean;
  msg?: string;
};

type OptionCustom = {
  before?: (dirName: string) => (void | BeforeRes | Promise<BeforeRes>);
  after?: () => (void | AfterRes | Promise<AfterRes>);
  tplPkj?: string;
  tplPkjTag?: string;
  tplPkjParams?: string[];
  pkjFieldName?: string;
  configFileName?: string;
  initPath?: string;
};

const ProjectDict = {
  'spa-react': 'spa-react (React SPA)',
  'spa-react (React SPA)': 'spa-react',
  'spa-react-pc': 'spa-react-pc (React Admin App)',
  'spa-react-pc (React Admin App)': 'spa-react-pc',
  'spa-vue': 'spa-vue (Vue SPA)',
  'spa-vue (Vue SPA)': 'spa-vue',
  'ssr-react': 'ssr-react (React SSR App)',
  'ssr-react (React SSR App)': 'ssr-react',
  'component-react': 'component-react (React Component Library)',
  'component-react (React Component Library)': 'component-react',
  'component-vue': 'component-vue (Vue Component Library)',
  'component-vue (Vue Component Library)': 'component-vue',
  'toolkit': 'toolkit (Tool Library)',
  'toolkit (Tool Library)': 'toolkit'
};

const ServerTypes = {
  ssr: {
    'next-app(recommend)': 'next-app',
    'next-pages': 'next-pages',
  },
  cpLib: {
    'storybook(recommend)': 'storybook',
  }
};

const LayoutDict = {
  viewport: 'viewport(vw/vh)',
  'viewport(vw/vh)': 'viewport',
  rem: 'rem',
  px: 'px'
};

const stat = promisify(fs.stat);

async function isDir(dirName: string) {
  const dirPath = path.resolve(process.cwd(), dirName);
  if (fs.existsSync(dirPath)) {
    try {
      const stats = await stat(dirPath);
      if (stats.isDirectory()) {
        return true;
      }
      // eslint-disable-next-line no-empty
    } catch (e) { }
  }
  return false;
}

async function checkPkgTool(pkgtool: PKJ_TOOL) {
  // install tool precheck
  return new Promise((resolve, reject) => {
    let hasTool = true;
    try {
      execSync(`${pkgtool} -v`, { stdio: 'ignore' });
    } catch (e) {
      hasTool = false;
    }

    if (!hasTool) {
      if (pkgtool === 'npm') {
        spinner.state('warn', 'Cannot find the npm package management tool. Please install it manually!');
        process.exit(0);
      } else {
        spinner.state('info', `Missing package management tool ${pkgtool}!`);
        inquirer.prompt([{
          name: 'install',
          type: 'confirm',
          message: `${logo()}Automatically install ${pkgtool} globally?`,
          default: true
        }]).then(answers => {
          const { install } = answers;
          if (!install) {
            reject(false);
            return process.exit(0);
          }
          try {
            execSync(`npm i -g ${pkgtool}`, { stdio: 'ignore' });
            resolve(true);
          } catch (e) {
            try {
              execSync(`sudo npm i -g ${pkgtool}`, { stdio: 'inherit' });
              resolve(true);
            } catch (err) {
              logWarn(err as string);
              logWarn(`The setup ${pkgtool} failed, please try it by yourself`);
              logWarn(`Failed to install ${pkgtool}, please install it manually and try again.`);
              process.exit(0);
            }
          }
        });
      }
    } else {
      resolve(true);
    }
  });
}

function mkdir(dirPath: string) {
  dirPath && fsExtra.ensureDirSync(dirPath, { mode: 0o2777 });
}

function presetTpl(type: Exclude<keyof OptionType, 'install'>) {
  let cli, pkj = '';
  switch (type) {
    case 'react_basic':
      cli = presetCli.cli_basic_react;
      pkj = '@omni-door/tpl-spa-react';
      break;
    case 'react_standard':
      cli = presetCli.cli_standard_react;
      pkj = '@omni-door/tpl-spa-react';
      break;
    case 'react_entire':
      cli = presetCli.cli_entire_react;
      pkj = '@omni-door/tpl-spa-react';
      break;
    case 'react_pc':
      cli = presetCli.cli_pc_react;
      pkj = '@omni-door/tpl-spa-react-pc';
      break;
    case 'vue_basic':
      cli = presetCli.cli_basic_vue;
      pkj = '@omni-door/tpl-spa-vue';
      break;
    case 'vue_standard':
      cli = presetCli.cli_standard_vue;
      pkj = '@omni-door/tpl-spa-vue';
      break;
    case 'vue_entire':
      cli = presetCli.cli_entire_vue;
      pkj = '@omni-door/tpl-spa-vue';
      break;
    case 'react_ssr':
      cli = presetCli.cli_ssr_react;
      pkj = '@omni-door/tpl-ssr-react';
      break;
    case 'react_components':
      cli = presetCli.cli_components_react;
      pkj = '@omni-door/tpl-component-react';
      break;
    case 'vue_components':
      cli = presetCli.cli_components_vue;
      pkj = '@omni-door/tpl-component-vue';
      break;
    case 'toolkit':
      cli = presetCli.cli_toolkit;
      pkj = '@omni-door/tpl-toolkit';
      break;
  }

  return { cli, pkj };
}

export default async function (strategy: STRATEGY, {
  react_basic,
  react_standard,
  react_entire,
  react_pc,
  vue_basic,
  vue_standard,
  vue_entire,
  react_ssr,
  react_components,
  vue_components,
  toolkit,
  install
}: OptionType, option?: OptionCustom) {
  try {
    // node version pre-check
    await nodeVersionCheck('10.13.0');
  } catch (e) {
    logWarn(e as string);
  }

  // bind exit signals
  signal();

  // whether the config file exsit
  let configFileExist = false;

  // default template package
  let tplPackage: string;

  // reset illegal strategy
  strategy = (strategy === 'stable' || strategy === 'latest') ? strategy : 'stable';

  // npm versions' promise
  let versionsPromise: undefined | Promise<string[]>;

  const {
    before,
    after,
    tplPkj,
    tplPkjTag,
    tplPkjParams = [],
    pkjFieldName = 'omni',
    configFileName = 'omni.config.js',
    initPath: customInitPath
  } = option || {};

  const tplParams: string[] = [`install=${install}`];
  let configPath = path.resolve(configFileName);

  const CWD = process.cwd();
  const realCWD = customInitPath || CWD;
  try {
    let ppkj;
    const ppkjPath = path.resolve(realCWD, 'package.json');
    if (fs.existsSync(ppkjPath)) ppkj = require(ppkjPath);

    configPath = path.resolve(realCWD, (ppkj && ppkj[pkjFieldName] && ppkj[pkjFieldName]['filePath']) || configFileName);
  } catch (e) {
    logWarn(e as string);
  }

  // get project name
  const { name: defaultName } = parse(realCWD);
  let presetType: keyof typeof types | '' = '';
  let projectName = defaultName;
  const types = {
    react_basic,
    react_standard,
    react_entire,
    react_pc,
    vue_basic,
    vue_standard,
    vue_entire,
    react_ssr,
    react_components,
    vue_components,
    toolkit
  };
  for (const k in types) {
    const type = k as keyof typeof types;
    const item = types[type];
    if (item) {
      presetType = type;
      typeof item === 'string' && (projectName = item);
      break;
    }
  }

  try {
    spinner.color('green');
    spinner.prefix('arrow3');
    if (presetType) {
      pkgNameCheck(projectName);
      if (fs.existsSync(configPath)) {
        configFileExist = true;
        // double confirmation
        await new Promise((resolve) => {
          inquirer.prompt([{
            name: 'overwrite',
            type: 'confirm',
            message: `${logo()}Are you sure to overwrite the "${configFileName}"?`,
            default: false
          }]).then(answers => {
            const { overwrite } = answers;
            if (!overwrite) return process.exit(0);
            resolve(void 0);
          });
        }).catch(err => {
          logErr(err);
          spinner.state('fail', 'Initialization encountered an error!');
          process.exit(1);
        });
      }
      const { cli, pkj } = presetTpl(presetType);
      await checkPkgTool(cli ? cli.pkgtool : 'pnpm');

      tplPackage = pkj;
      if (tplPkjTag) {
        versionsPromise = getNpmVersions(tplPkj || tplPackage);
      }
      tplParams.push(`strategy=${strategy}`);
      for (const k in cli) {
        tplParams.push(`${k}=${cli[k as keyof typeof cli]}`);
      }
    } else {
      let currStep = 1;
      let totalStep: string | number = '?';

      const getProjectType = (answer: any) => {
        return ProjectDict[answer.project_type as keyof typeof ProjectDict];
      };

      const questions = [
        {
          name: 'overwrite',
          type: 'confirm',
          message: `${logo()}Are you sure to overwrite this project?`,
          default: false
        }, {
          name: 'project_type',
          type: 'list',
          choices: [
            ProjectDict['spa-react'],
            ProjectDict['spa-react-pc'],
            ProjectDict['spa-vue'],
            ProjectDict['component-react'],
            ProjectDict['component-vue'],
            ProjectDict['ssr-react'],
            ProjectDict['toolkit']
          ],
          message: `${logo()}[${currStep}/${totalStep}] Please choose the project type:`,
          when: function (answer: any) {
            if (answer.overwrite === false) {
              return process.exit(0);
            }
            return true;
          }
        }, {
          name: 'name',
          type: 'input',
          message: function (answer: any) {
            const projectType = getProjectType(answer);
            switch (projectType) {
              case 'spa-react':
              case 'spa-vue':
                totalStep = 7;
                break;
              case 'ssr-react':
              case 'spa-react-pc':
                totalStep = 6;
                break;
              case 'component-react':
              case 'component-vue':
                totalStep = 4;
                break;
              default:
                totalStep = 3;
            }
            install && totalStep++;
            return `${logo()}[${++currStep}/${totalStep}] Please enter your project name:`;
          },
          validate: async function (input: any) {
            const isValidName = pkgNameCheck(input, true);
            const isExisted = await isDir(input);
            if (isValidName && !isExisted) return true;
            if (isExisted) {
              logWarn(`The "${input}" directory already exists.`);
            }
            return isExisted ? `The "${input}" directory already exists.` : 'Please re-enter your project name.';
          },
          default: defaultName
        },
        {
          name: 'server',
          type: 'list',
          choices: function (answer: any) {
            const projectType = getProjectType(answer);
            if (projectType === 'ssr-react') {
              return Object.keys(ServerTypes.ssr);
            }
            return Object.keys(ServerTypes.cpLib);
          },
          default: function (answer: any) {
            const projectType = getProjectType(answer);
            if (projectType === 'ssr-react') {
              return Object.keys(ServerTypes.ssr)[0];
            }
            return Object.keys(ServerTypes.cpLib)[0];
          },
          message: function (answer: any) {
            const projectType = getProjectType(answer);
            const msg = projectType === 'ssr-react' ? 'Please choose the SSR server type' : 'Please choose the component-library demo framework';
            return `${logo()}[${++currStep}/${totalStep}] ${msg}：`;
          },
          when: async function (answer: any) {
            const projectType = getProjectType(answer);
            return projectType === 'ssr-react';
          }
        },
        {
          name: 'ts',
          type: 'confirm',
          message: function (answer: any) {
            return `${logo()}[${++currStep}/${totalStep}] Use TypeScript?`;
          },
          default: true,
          when: function (answer: any) {
            const projectType = getProjectType(answer);
            if (projectType === 'spa-react' || projectType === 'spa-react-pc' || projectType === 'spa-vue' || projectType === 'ssr-react') {
              return true;
            }
            return false;
          }
        },
        {
          name: 'test',
          type: 'confirm',
          message: function (answer: any) {
            return `${logo()}[${++currStep}/${totalStep}] Enable unit tests?`;
          },
          default: (answer: any) => getProjectType(answer) !== 'spa-react' && getProjectType(answer) !== 'spa-react-pc' && getProjectType(answer) !== 'spa-vue' && getProjectType(answer) !== 'ssr-react',
          when: function (answer: any) {
            const projectType = getProjectType(answer);
            if (projectType === 'spa-react' || projectType === 'spa-react-pc' || projectType === 'spa-vue' || projectType === 'ssr-react') {
              return true;
            }
            return false;
          }
        },
        {
          name: 'style',
          type: 'checkbox',
          choices: ['css', 'less', 'scss'],
          message: function (answer: any) {
            return `${logo()}[${++currStep}/${totalStep}] Select stylesheets:`;
          },
          default: ['css'],
          when: async function (answer: any) {
            if (getProjectType(answer) === 'toolkit' || getProjectType(answer) === 'ssr-react') {
              return false;
            }
            await nodeVersionCheck('12');
            return true;
          }
        },
        {
          name: 'layout',
          type: 'list',
          when: (answer: any) => {
            const projectType = getProjectType(answer);
            if (projectType === 'spa-react' || projectType === 'spa-vue') return true;

            if (answer?.style?.length === 0) {
              ++currStep;
              return false;
            }
            return false;
          },
          choices: [LayoutDict.px, LayoutDict.viewport, LayoutDict.rem],
          message: function (answer: any) {
            return `${logo()}[${++currStep}/${totalStep}] Select layout plan:`;
          }
        },
        {
          name: 'lint',
          type: 'checkbox',
          choices: (answer: any) => {
            const lintArr = ['eslint', 'prettier', 'commitlint', 'stylelint'];
            (answer?.style?.length === 0 || getProjectType(answer) === 'toolkit') && lintArr.pop();
            return lintArr;
          },
          message: function (answer: any) {
            return `${logo()}[${++currStep}/${totalStep}] Select lint tools:`;
          },
          default: ['eslint']
        },
        {
          name: 'pkgtool',
          type: 'list',
          choices: ['pnpm', 'yarn', 'npm'],
          when: function () {
            if (!install) return false;
            return true;
          },
          message: function (answer: any) {
            return `${logo()}[${++currStep}/${totalStep}] Select the package manager:`;
          },
          default: 'pnpm'
        }
      ];

      // if the config file non-existence，cancel double confirmation
      if (!fs.existsSync(configPath)) {
        questions.shift();
      } else {
        configFileExist = true;
      }

      await new Promise((resolve) => {
        inquirer.prompt(questions)
          .then(async answers => {
            const {
              project_type,
              name,
              server: _server = '',
              ts = true,
              test = true,
              style = [],
              layout = 'px',
              lint = [],
              pkgtool = 'pnpm'
            } = answers;

            await checkPkgTool(pkgtool);

            let server = '';
            Object.keys(ServerTypes).some(t => {
              const list = ServerTypes[t as keyof typeof ServerTypes];
              server = list[_server as keyof typeof list] ?? '';
              return !!server;
            });
            const eslint = !!~lint.indexOf('eslint');
            const prettier = !!~lint.indexOf('prettier');
            const commitlint = !!~lint.indexOf('commitlint');
            const stylelint = !!~lint.indexOf('stylelint');
            const stylesheet = style.length === 0
              ? ''
              : style.includes('less') && style.includes('scss')
                ? 'all'
                : style.includes('less')
                  ? 'less'
                  : style.includes('scss')
                    ? 'scss'
                    : 'css';
            const projectType = ProjectDict[project_type as keyof typeof ProjectDict];

            projectName = name;
            tplParams.push(
              `strategy=${strategy}`,
              `project_type=${projectType}`,
              `pkgtool=${pkgtool}`,
              `ts=${ts}`,
              `test=${test}`,
              `eslint=${eslint}`,
              `prettier=${prettier}`,
              `commitlint=${commitlint}`,
              `style=${stylesheet}`,
              `layout=${LayoutDict[layout as keyof typeof LayoutDict]}`,
              `stylelint=${stylelint}`,
              `devServer=${server}`,
              `spaServer=${server}`,
              `ssrServer=${server}`,
              `componentServer=${server}`
            );

            switch (projectType) {
              case 'spa-react':
                tplPackage = '@omni-door/tpl-spa-react';
                break;
              case 'spa-react-pc':
                tplPackage = '@omni-door/tpl-spa-react-pc';
                break;
              case 'spa-vue':
                tplPackage = '@omni-door/tpl-spa-vue';
                break;
              case 'ssr-react':
                tplPackage = '@omni-door/tpl-ssr-react';
                break;
              case 'component-react':
                tplPackage = '@omni-door/tpl-component-react';
                break;
              case 'component-vue':
                tplPackage = '@omni-door/tpl-component-vue';
                break;
              case 'toolkit':
                tplPackage = '@omni-door/tpl-toolkit';
                break;
            }
            if (tplPkjTag) {
              versionsPromise = getNpmVersions(tplPkj || tplPackage);
            }
            resolve(void 0);
          });
      }).catch(err => {
        logErr(err);
        spinner.state('fail', 'Initialization encountered an error!');
        process.exit(1);
      });
    }

    const beforeRes = typeof before === 'function' && await before(projectName);
    const {
      create_dir,
      dir_name,
      stdout
    } = beforeRes || {};
    const isSilent = typeof stdout === 'boolean' ? !stdout : false;
    const dirName = dir_name || projectName;
    const initPath = customInitPath || path.resolve(CWD, configFileExist ? '' : dirName);

    if (!configFileExist && await isDir(dirName)) {
      await new Promise((resolve) => {
        inquirer.prompt([{
          name: 'overwrite_dir',
          type: 'confirm',
          message: `${logo()}Overwrite the "${dirName}" directory? Please confirm again.`,
          default: true
        }]).then(answers => {
          const { overwrite_dir } = answers;
          if (!overwrite_dir) return process.exit(0);
          resolve(void 0);
        });
      }).catch(err => {
        logErr(err);
        spinner.state('fail', 'Initialization encountered an error!');
        process.exit(1);
      });
    }

    tplParams.push(
      `projectName=${dir_name || projectName}`,
      `initPath=${initPath}`,
      `isSilent=${isSilent}`
    );
    // loading start display
    spinner.state('start', 'Initializing, please wait...');
    // create the folder
    !configFileExist && create_dir !== false && mkdir(initPath);

    let templatePackageTag = tplPkjTag || 'latest';
    if (tplPkjTag && versionsPromise) {
      const matchVer = tplPkjTag.match(/\d+.\d+/)?.[0];
      if (matchVer) {
        const versions = await versionsPromise;
        const [firstNum, secondNum] = matchVer.split('.');
        const regexp = new RegExp(`^${firstNum}{1}.${secondNum}{1}.\\d+$`);
        const thirdNum = Math.max(...versions.filter(v => regexp.test(v)).map(v => +(v.split('.')?.[2] ?? 0)));
        templatePackageTag = `${firstNum}.${secondNum}.${thirdNum}`;
      }
    }

    return figlet(getBrand(), function (err, data) {
      if (err) {
        logErr(err.message);
        spinner.state('fail', 'Figlet encountered an error!');
      }
      const commitlint = !!~tplParams.indexOf('commitlint=true');
      const execPath = tplParams.find(param => param.startsWith('initPath='))?.split('=')?.[1];
      const initCmd = `npx ${tplPkj || tplPackage}@${templatePackageTag} init ${arr2str([...tplParams, ...tplPkjParams])}`;
      logInfo(`Exec: ${initCmd}`);

      return exec(
        [initCmd],
        async function () {
          const afterRes = typeof after === 'function' && await after();
          let { success, msg } = afterRes || {};
          if (success && commitlint && execPath) {
            try {
              logInfo(`git and husky init: ${execPath}`);
              execSync('git init', { cwd: execPath, stdio: 'inherit' });
              execSync('npm run prepare', { cwd: execPath, stdio: 'inherit' });
            } catch (e) {
              success = false;
              // @ts-ignore
              msg = e?.message || e;
            }
          }

          if (success === false) {
            spinner.state('fail', msg || 'Initialize project failed!');
          } else {
            spinner.state('succeed', msg || 'Initialize project success!');
          }

          data && console.info(chalk.yellow(data));
          process.exit(0);
        },
        async function (err: any) {
          logErr(err);
          spinner.state('fail', 'Initialize project failed!');
          process.exit(1);
        }
      );
    });
  } catch (err) {
    logErr(err as string);
    spinner.state('fail', 'Initialization encountered an error!');
    process.exit(1);
  }
}
