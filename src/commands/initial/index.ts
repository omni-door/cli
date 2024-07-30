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
import type { PKJTOOL, STRATEGY } from '@omni-door/utils';

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
  'spa-react': 'spa-react (React单页应用)',
  'spa-react (React单页应用)': 'spa-react',
  'spa-react-pc': 'spa-react-pc (React中后台应用)',
  'spa-react-pc (React中后台应用)': 'spa-react-pc',
  'spa-vue': 'spa-vue (Vue单页应用)',
  'spa-vue (Vue单页应用)': 'spa-vue',
  'ssr-react': 'ssr-react (React服务端渲染应用)',
  'ssr-react (React服务端渲染应用)': 'ssr-react',
  'component-react': 'component-react (React组件库)',
  'component-react (React组件库)': 'component-react',
  'component-vue': 'component-vue (Vue组件库)',
  'component-vue (Vue组件库)': 'component-vue',
  'toolkit': 'toolkit (工具库)',
  'toolkit (工具库)': 'toolkit'
};

const ServerTypes = {
  ssr: {
    'next': 'next',
    'koa-next(deprecated)': 'koa-next',
  },
  cpLib: {
    'storybook(recommend)': 'storybook',
    'docz': 'docz',
    'styleguidist(deprecated)': 'styleguidist',
    'bisheng(deprecated)': 'bisheng'
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

async function checkPkgTool(pkgtool: PKJTOOL) {
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
        spinner.state('warn', 'Cannot found the npm package management tool(没有找到 npm 包管理工具，请自行安装)!');
        process.exit(0);
      } else {
        spinner.state('info', `Missing package management tool ${pkgtool}(缺少包管理工具 ${pkgtool})!`);
        inquirer.prompt([{
          name: 'install',
          type: 'confirm',
          message: `${logo()}Automatic install the ${pkgtool} in the global environment(自动安装 ${pkgtool} 到全局环境)?`,
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
              logWarn(`${pkgtool} 安装失败，请自行安装后再试`);
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
            message: `${logo()}Are you sure to overwrite the "${configFileName}"(确定要覆盖已经存在的 "${configFileName}" 文件)?`,
            default: false
          }]).then(answers => {
            const { overwrite } = answers;
            if (!overwrite) return process.exit(0);
            resolve(void 0);
          });
        }).catch(err => {
          logErr(err);
          spinner.state('fail', 'The initializing occurred some accidents(项目初始化发生错误)!');
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
          message: `${logo()}Are you sure to overwrite this project (确定覆盖该项目)?`,
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
          message: `${logo()}[${currStep}/${totalStep}] Please choose the type of project (请选择项目类型):`,
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
                totalStep = 5;
                break;
              case 'component-vue':
                totalStep = 4;
                break;
              default:
                totalStep = 3;
            }
            install && totalStep++;
            return `${logo()}[${++currStep}/${totalStep}] Please enter your project name (请输入项目名称):`;
          },
          validate: async function (input: any) {
            const isValidName = pkgNameCheck(input, true);
            const isExisted = await isDir(input);
            if (isValidName && !isExisted) return true;
            if (isExisted) {
              logWarn(`The "${input}" directory had been existed ("${input}" 文件夹已经存在)`);
            }
            return isExisted ? `The "${input}" directory had been existed ("${input}" 文件夹已经存在)` : 'Please re-input your project name (请重新输入项目名称)';
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
            const msg = projectType === 'ssr-react' ? 'Please chioce the SSR server type (请选择SSR服务类型)' : 'Please chioce the component-library demonstration frame (请选择组件库Demo框架)';
            return `${logo()}[${++currStep}/${totalStep}] ${msg}：`;
          },
          when: async function (answer: any) {
            const projectType = getProjectType(answer);
            if (projectType === 'component-react' || projectType === 'ssr-react') {
              return true;
            }
            return false;
          }
        },
        {
          name: 'ts',
          type: 'confirm',
          message: function (answer: any) {
            return `${logo()}[${++currStep}/${totalStep}] Apply typescript(使用typescript)?`;
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
            return `${logo()}[${++currStep}/${totalStep}] Apply unit-test(开启单元测试)?`;
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
            return `${logo()}[${++currStep}/${totalStep}] Select the stylesheets(选择样式文件):`;
          },
          default: ['css'],
          when: async function (answer: any) {
            if (getProjectType(answer) === 'toolkit' || getProjectType(answer) === 'ssr-react') {
              return false;
            }
            if (answer.server === 'docz') await nodeVersionCheck('12');
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
          choices: [LayoutDict.viewport, LayoutDict.rem, LayoutDict.px],
          message: function (answer: any) {
            return `${logo()}[${++currStep}/${totalStep}] Select layout plan(选择布局适配方案):`;
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
            return `${logo()}[${++currStep}/${totalStep}] Select the lint tools(选择lint工具):`;
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
            return `${logo()}[${++currStep}/${totalStep}] Select the package install tool(请选择包安装工具):`;
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
              server = list[_server as keyof typeof list];
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
        spinner.state('fail', 'The initializing occurred some accidents(项目初始化发生错误)!');
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
          message: `${logo()} Overwrite the "${dirName}" directory, please confirm again(请再次确认覆盖 "${dirName}" 文件夹)!`,
          default: true
        }]).then(answers => {
          const { overwrite_dir } = answers;
          if (!overwrite_dir) return process.exit(0);
          resolve(void 0);
        });
      }).catch(err => {
        logErr(err);
        spinner.state('fail', 'The initializing occurred some accidents(项目初始化发生错误)!');
        process.exit(1);
      });
    }

    tplParams.push(
      `projectName=${dir_name || projectName}`,
      `initPath=${initPath}`,
      `isSilent=${isSilent}`
    );
    // loading start display
    spinner.state('start', 'Initializing, please wait patiently(项目初始化中)');
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
        spinner.state('fail', 'Something about figlet is wrong(figlet 出现了问题)!');
      }
      const initCmd = `npx ${tplPkj || tplPackage}@${templatePackageTag} init ${arr2str([...tplParams, ...tplPkjParams])}`;
      logInfo(`Exec: ${initCmd}`);
      return exec(
        [ initCmd ],
        async function () {
          const afterRes = typeof after === 'function' && await after();
          const { success, msg } = afterRes || {};

          if (success === false) {
            spinner.state('fail', msg || 'Initialize project failed(初始化项目失败)!');
          } else {
            spinner.state('succeed', msg || 'Initialize project success(初始化项目完成)!');
          }

          data && console.info(chalk.yellow(data));
          process.exit(0);
        },
        async function (err: any) {
          logErr(err);
          spinner.state('fail', 'Initialize project failed(初始化项目失败)!');
          process.exit(1);
        }
      );
    });
  } catch (err) {
    logErr(err as string);
    spinner.state('fail', 'The initializing occurred some accidents(项目初始化发生错误)!');
    process.exit(1);
  }
}