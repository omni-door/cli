import fs from 'fs';
import path, { parse } from 'path';
import { promisify } from 'util';
import { execSync } from'child_process';
import fsExtra from 'fs-extra';
import shelljs from 'shelljs';
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
  getBrand,
  node_version,
  name_check
} from '@omni-door/utils';
import { logo, signal, CLITAG, TPLTAG } from '../../utils';
/* import types */
import type { PKJTOOL, STRATEGY } from '@omni-door/utils';

type OptionType = {
  react_basic?: boolean | string;
  react_standard?: boolean | string;
  react_entire?: boolean | string;
  react_ssr?: boolean | string;
  react_components?: boolean | string;
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
  'ssr-react': 'ssr-react (React服务端渲染应用)',
  'ssr-react (React服务端渲染应用)': 'ssr-react',
  'component-react': 'component-react (React组件库)',
  'component-react (React组件库)': 'component-react',
  'toolkit': 'toolkit (工具库)',
  'toolkit (工具库)': 'toolkit'
};

const LayoutDict = {
  viewport: 'viewport(vw/vh)',
  'viewport(vw/vh)': 'viewport',
  rem: 'rem',
  px: 'px'
};

const stat = promisify(fs.stat);

async function isDir (dirName: string) {
  const dirPath = path.resolve(process.cwd(), dirName);
  if (fs.existsSync(dirPath)) {
    try {
      const stats = await stat(dirPath);
      if (stats.isDirectory()) {
        return true;
      }
    // eslint-disable-next-line no-empty
    } catch (e) {}
  }
  return false;
}

async function checkPkgTool (pkgtool: PKJTOOL) {
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
        spinner.state('warn', '没有找到 npm 包管理工具，请自行安装！(Cannot found the npm package management tool!)');
        process.exit(0);
      } else {
        spinner.state('info', `缺少包管理工具 ${pkgtool}！(Missing package management tool ${pkgtool}!)`);
        inquirer.prompt([{
          name: 'install',
          type: 'confirm',
          message: `${logo()} 自动安装 ${pkgtool} 到全局环境? (Automatic install the ${pkgtool} in the global environment?)`,
          default: true
        }]).then(answers => {
          const { install } = answers;
          if (!install) {
            reject(false);
            return process.exit(0);
          }
          shelljs.exec(`npm i -g ${pkgtool}`, { async: false });
          resolve(true);
        });
      }
    } else {
      resolve(true);
    }
  });
}

function mkdir (dirPath: string) {
  dirPath && fsExtra.ensureDirSync(dirPath, { mode: 0o2777 });
}

function presetTpl (type: Exclude<keyof OptionType, 'install'>) {
  let cli, pkj = '';
  switch(type) {
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
    case 'react_ssr':
      cli = presetCli.cli_ssr_react;
      pkj = '@omni-door/tpl-ssr-react';
      break;
    case 'react_components':
      cli = presetCli.cli_components_react;
      pkj = '@omni-door/tpl-component-react';
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
  react_ssr,
  react_components,
  toolkit,
  install
}: OptionType, option?: OptionCustom) {
  try {
    // node version pre-check
    await node_version('10.13.0');
  } catch (e) {
    logWarn(e);
  }

  // bind exit signals
  signal();

  // whether the config file exsit
  let configFileExist = false;

  // default template package
  let tplPackage: string;

  // reset illegal strategy
  strategy = (strategy === 'stable' || strategy === 'latest') ? strategy : 'stable';

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

  const tplParams: string[] = [ `install=${install}`, `tag=${CLITAG || TPLTAG ? `~${TPLTAG}` : 'latest'}` ];
  let configPath = path.resolve(configFileName);

  const CWD = process.cwd();
  const realCWD = customInitPath || CWD;
  try {
    let ppkj;
    const ppkjPath = path.resolve(realCWD, 'package.json');
    if (fs.existsSync(ppkjPath)) ppkj = require(ppkjPath);

    configPath = path.resolve(realCWD, (ppkj && ppkj[pkjFieldName] && ppkj[pkjFieldName]['filePath']) || configFileName);
  } catch (e) {
    logWarn(e);
  }

  // get project name
  const { name: defaultName } = parse(realCWD);
  let presetType: keyof typeof types | '' = '';
  let projectName = defaultName;
  const types = {
    react_basic,
    react_standard,
    react_entire,
    react_ssr,
    react_components,
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
      name_check(projectName);
      if (fs.existsSync(configPath)) {
        configFileExist = true;
        // double confirmation
        await new Promise((resolve) => {
          inquirer.prompt([{
            name: 'overwrite',
            type: 'confirm',
            message: `${logo()} 确定要覆盖已经存在的 [${configFileName}] 文件? (Are you sure to overwrite [${configFileName}]?)`,
            default: false
          }]).then(answers => {
            const { overwrite } = answers;
            if (!overwrite) return process.exit(0);
            resolve(void 0);
          });
        }).catch(err => {
          logErr(err);
          spinner.state('fail', '项目初始化发生错误！(The initializing occurred some accidents!)');
          process.exit(1);
        });
      }
      const { cli, pkj } = presetTpl(presetType);
      await checkPkgTool(cli ? cli.pkgtool : 'pnpm');

      tplPackage = pkj;
      tplParams.push(`strategy=${strategy}`);
      for (const k in cli) {
        tplParams.push(`${k}=${cli[k as keyof typeof cli]}`);
      }
    } else {
      let currStep = 1;
      let totalStep: string | number = '?';
      let isValidName = true;
      const dupDirQuestions = [];
      const retryTimes = 10; // reenter name limit
      while (dupDirQuestions.length < retryTimes * 2) {
        dupDirQuestions.push(...[{
          name: 'overwrite_dir',
          type: 'confirm',
          default: false,
          message: async function (answer: any) {
            const { name } = answer;
            return `${logo()}[${currStep}/${totalStep}] 确定要覆盖已经存在的 [${name}] 文件夹? (Are you sure to overwrite [${name}] directory?)`;
          },
          when: async function (answer: any) {
            isValidName = name_check(answer.name, true);
            const { name, overwrite_dir } = answer;
            return isValidName && !configFileExist && !overwrite_dir && await isDir(name);
          }
        }, {
          name: 'name',
          type: 'input',
          message: function (answer: any) {
            return `${logo()}[${currStep}/${totalStep}] 请重新输入项目名称 (Please reenter your project name)：`;
          },
          when: async function (answer: any) {
            const { name } = answer;
            return !isValidName || (!configFileExist && answer.overwrite_dir === false && await isDir(name));
          },
          default: defaultName
        }]);
      }

      const getProjectType = (answer: any) => {
        return ProjectDict[answer.project_type as keyof typeof ProjectDict];
      };

      const questions = [
        {
          name: 'overwrite',
          type: 'confirm',
          message: `${logo()} 确定要覆盖已经存在的 [${configFileName}] 文件? (Are you sure to overwrite [${configFileName}]?)`,
          default: false
        },{
          name: 'project_type',
          type: 'list',
          choices: [
            ProjectDict['spa-react'],
            ProjectDict['ssr-react'],
            ProjectDict['component-react'],
            ProjectDict['toolkit']
          ],
          message: `${logo()}[${currStep}/${totalStep}] 请选择项目类型 (Please choose the type of project)：`,
          when: function (answer: any) {
            if (answer.overwrite === false) {
              return process.exit(0);
            }
            return true;
          }
        },{
          name: 'name',
          type: 'input',
          message: function (answer: any) {
            const projectType = getProjectType(answer);
            switch (projectType) {
              case 'spa-react':
                totalStep = install ? 8 : 7;
                break;
              case 'ssr-react':
                totalStep = install ? 8 : 7;
                break;
              case 'component-react':
                totalStep = install ? 6 : 5;
                break;
              default:
                totalStep = install ? 4 : 3;
            }
            return `${logo()}[${++currStep}/${totalStep}] 请输入项目名称 (Please enter your project name)：`;
          },
          default: defaultName
        },
        ...dupDirQuestions,
        {
          name: 'server',
          type: 'list',
          choices: function (answer: any) {
            const projectType = getProjectType(answer);
            if (projectType === 'ssr-react') {
              return [ 'next', 'koa-next' ];
            }
            return [ 'docz', 'storybook', 'styleguidist', 'bisheng' ];
          },
          default: function (answer: any) {
            const projectType = getProjectType(answer);
            if (projectType === 'ssr-react') {
              return 'next';
            }
            return 'docz';
          },
          message: function (answer: any) {
            const projectType = getProjectType(answer);
            const msg = projectType === 'ssr-react' ? '请选择SSR服务类型 (Please chioce the SSR server type)' : '请选择组件库Demo框架 (Please chioce the component-library demonstration frame)';
            return `${logo()}[${++currStep}/${totalStep}] ${msg}：`;
          },
          when: async function (answer: any) {
            const { overwrite_dir, name } = answer;
            if (!configFileExist && !overwrite_dir && await isDir(name)) {
              logWarn('失败次数太多，请想清楚后再试！(Please turn over to think then try again!)');
              return process.exit(0);
            }
            const projectType = getProjectType(answer);
            if (projectType === 'component-react' || projectType === 'ssr-react') {
              return true;
            }
            return false;
          }
        },{
          name: 'ts',
          type: 'confirm',
          message: function (answer: any) {
            return `${logo()}[${++currStep}/${totalStep}] 是否使用typescript? (Whether or not apply typescript?)`;
          },
          default: true,
          when: function (answer: any) {
            const projectType = getProjectType(answer);
            if (projectType === 'spa-react' || projectType === 'ssr-react') {
              return true;
            }
            return false;
          }
        },{
          name: 'test',
          type: 'confirm',
          message: function (answer: any) {
            return `${logo()}[${++currStep}/${totalStep}] 是否开启单元测试? (Whether or not apply unit-test?)`;
          },
          default: (answer: any) => getProjectType(answer) !== 'spa-react' && getProjectType(answer) !== 'ssr-react',
          when: function (answer: any) {
            const projectType = getProjectType(answer);
            if (projectType === 'spa-react' || projectType === 'ssr-react') {
              return true;
            }
            return false;
          }
        },{
          name: 'style',
          type: 'checkbox',
          choices: [ 'css', 'less', 'scss' ],
          message: function (answer: any) {
            return `${logo()}[${++currStep}/${totalStep}] 选择样式文件 (Please select the stylesheets)`;
          },
          default: [ 'css' ],
          when: function (answer: any) {
            if (getProjectType(answer) === 'toolkit') {
              return false;
            }
            return true;
          }
        },{
          name: 'layout',
          type: 'list',
          when: (answer: any) => {
            const projectType = getProjectType(answer);
            if (answer.style.length === 0) {
              ++currStep;
              return false;
            }
            if (projectType === 'spa-react') return true;
            return false;
          },
          choices: [LayoutDict.viewport, LayoutDict.rem, LayoutDict.px],
          message: function (answer: any) {
            return `${logo()}[${++currStep}/${totalStep}] 选择布局适配方案 (Please select layout plan)`;
          }
        },{
          name: 'lint',
          type: 'checkbox',
          choices: (answer: any) => {
            const lintArr = [ 'eslint', 'prettier', 'commitlint', 'stylelint' ];
            (answer.style.length === 0 || getProjectType(answer) === 'toolkit') && lintArr.pop();
            return lintArr;
          },
          message: function (answer: any) {
            return `${logo()}[${++currStep}/${totalStep}] 选择lint工具 (Please select the lint tools)：`;
          },
          default: [ 'eslint' ]
        },{
          name: 'pkgtool',
          type: 'list',
          choices: [ 'pnpm', 'yarn', 'npm' ],
          when: function () {
            if (!install) return false;
            return true;
          },
          message: function (answer: any) {
            return `${logo()}[${++currStep}/${totalStep}] 请选择包安装工具，推荐使用pnpm (Please choice the package install tool, recommended use pnpm)：`;
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
              server = '',
              ts = true,
              test = true,
              style = [],
              layout = 'px',
              lint = [],
              pkgtool = 'pnpm'
            } = answers;

            await checkPkgTool(pkgtool);

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
              case 'ssr-react':
                tplPackage = '@omni-door/tpl-ssr-react';
                break;
              case 'component-react':
                tplPackage = '@omni-door/tpl-component-react';
                break;
              case 'toolkit':
                tplPackage = '@omni-door/tpl-toolkit';
                break;
            }
            resolve(void 0);
          });
      }).catch(err => {
        logErr(err);
        spinner.state('fail', '项目初始化发生错误！(The initializing occurred some accidents!)');
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
    const initPath = customInitPath || path.resolve(CWD, dirName);

    if (!configFileExist && await isDir(dirName)) {
      await new Promise((resolve) => {
        inquirer.prompt([{
          name: 'overwrite_dir',
          type: 'confirm',
          message: `${logo()} 请再次确认覆盖 [${dirName}] 文件夹! (Please confirm overwrite the [${dirName}] directory again!)`,
          default: true
        }]).then(answers => {
          const { overwrite_dir } = answers;
          if (!overwrite_dir) return process.exit(0);
          resolve(void 0);
        });
      }).catch(err => {
        logErr(err);
        spinner.state('fail', '项目初始化发生错误！(The initializing occurred some accidents!)');
        process.exit(1);
      });
    }

    tplParams.push(
      `projectName=${dir_name || projectName}`,
      `initPath=${initPath}`,
      `isSilent=${isSilent}`
    );
    // loading start display
    spinner.state('start', '项目初始化中 (Initializing, please wait patiently)');
    // create the folder
    !configFileExist && create_dir !== false && mkdir(initPath);
    return figlet(getBrand(), function (err, data) {
      if (err) {
        logErr(err.message);
        spinner.state('fail', 'figlet 出现了问题！(Some thing about figlet is wrong!)');
      }

      return exec(
        [
          `npx ${tplPkj || tplPackage}@${tplPkjTag || TPLTAG ? `~${TPLTAG}` : 'latest'} init ${arr2str([ ...tplParams, ...tplPkjParams ])}`
        ],
        async function () {
          const afterRes = typeof after === 'function' && await after();
          const { success, msg } = afterRes || {};
    
          if (success === false) {
            spinner.state('fail', msg || '初始化项目失败！(Initialize project failed!)');
          } else {
            spinner.state('succeed', msg || '初始化项目完成！(Initialize project success!)');
          }
    
          data && console.info(chalk.yellow(data));
          process.exit(0);
        },
        async function (err: any) {
          logErr(err);
          spinner.state('fail', '初始化项目失败！(Initialize project failed!)');
          process.exit(1);
        }
      );
    });
  } catch (err) {
    logErr(err);
    spinner.state('fail', '项目初始化发生错误！(The initializing occurred some accidents!)');
    process.exit(1);
  }
}