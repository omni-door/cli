import fs from 'fs';
import path, { parse } from 'path';
import { promisify } from 'util';
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
  PKJTOOL,
  STRATEGY
} from '@omni-door/utils';
import { logo, signal } from '../../utils';

enum ProjectType {
  'spa-react (React单页应用)' = 'spa-react',
  'component-react (React组件库)' = 'component-react',
  'toolkit (工具库)' = 'toolkit'
}

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
    let iToolCheck = shelljs.exec(`${pkgtool} -v`, { async: false });

    if (~iToolCheck.stderr.indexOf('command not found')) {
      if (pkgtool === 'npm') {
        spinner.state('warn', '没有找到 npm 包管理工具！(Cannot found the npm package management tool!)');
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
  tplPkjParams?: string[];
  pkjFieldName?: string;
  configFileName?: string;
  initPath?: string;
};

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
    tplPkjParams = [],
    pkjFieldName = 'omni',
    configFileName = 'omni.config.js',
    initPath: customInitPath
  } = option || {};

  const tplParams: string[] = [ `install=${install}` ];
  let configPath = path.resolve(configFileName);

  try {
    const cwd = process.cwd();

    let ppkj;
    const ppkjPath = path.resolve(cwd, 'package.json');
    if (fs.existsSync(ppkjPath)) ppkj = require(ppkjPath);

    configPath = path.resolve(cwd, (ppkj && ppkj[pkjFieldName] && ppkj[pkjFieldName]['filePath']) || configFileName);
  } catch (e) {
    logWarn(e);
  }

  // get project name
  const { name: defaultName } = parse(process.cwd());
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
            resolve();
          });
        }).catch(err => {
          logErr(err);
          spinner.state('fail', '项目初始化发生错误！(The initializing occurred some accidents!)');
          process.exit(1);
        });
      }
      const { cli, pkj } = presetTpl(presetType);
      await checkPkgTool(cli ? cli.pkgtool : 'yarn');

      tplPackage = pkj;
      tplParams.push(`strategy=${strategy}`);
      for (const k in cli) {
        tplParams.push(`${k}=${cli[k as keyof typeof cli]}`);
      }
    } else {
      let currStep = 1;
      let totalStep: string | number = '?';
      let dupDirQuestions = [];
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
            const { name, overwrite_dir } = answer;
            return !configFileExist && !overwrite_dir && await isDir(name);
          }
        }, {
          name: 'name',
          type: 'input',
          message: function (answer: any) {
            return `${logo()}[${currStep}/${totalStep}] 请重新输入项目名称 (Please reenter your project name)：`;
          },
          when: async function (answer: any) {
            const { name } = answer;
            return !configFileExist && answer.overwrite_dir === false && await isDir(name);
          },
          default: defaultName
        }]);
      }

      const questions = [
        {
          name: 'overwrite',
          type: 'confirm',
          message: `${logo()} 确定要覆盖已经存在的 [${configFileName}] 文件? (Are you sure to overwrite [${configFileName}]?)`,
          default: false
        },{
          name: 'project_type',
          type: 'list',
          choices: [ 'spa-react (React单页应用)', 'component-react (React组件库)', 'toolkit (工具库)' ],
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
            if (ProjectType[answer.project_type as keyof typeof ProjectType] === 'spa-react') {
              totalStep = install ? 7 : 6;
            } else if (ProjectType[answer.project_type as keyof typeof ProjectType] === 'component-react') {
              totalStep = install ? 6 : 5;
            } else {
              totalStep = install ? 4 : 3;
            }
            return `${logo()}[${++currStep}/${totalStep}] 请输入项目名称 (Please enter your project name)：`;
          },
          default: defaultName
        },
        ...dupDirQuestions,
        {
          name: 'dev_server',
          type: 'list',
          choices: [ 'docz', 'storybook', 'styleguidist', 'bisheng' ],
          default: 'docz',
          message: function (answer: any) {
            return `${logo()}[${++currStep}/${totalStep}] 请选择组件库Demo框架 (Please chioce the component-library demonstration frame)：`;
          },
          when: async function (answer: any) {
            const { overwrite_dir, name, project_type } = answer;
            if (!configFileExist && !overwrite_dir && await isDir(name)) {
              logWarn('失败次数太多，检查该文件夹的内容后再试！(Please checking the directory then try again!)');
              return process.exit(0);
            }
            if (ProjectType[project_type as keyof typeof ProjectType] === 'component-react') {
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
            if (ProjectType[answer.project_type as keyof typeof ProjectType] === 'spa-react') {
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
          default: (answer: any) => ProjectType[answer.project_type as keyof typeof ProjectType] !== 'spa-react',
          when: function (answer: any) {
            if (ProjectType[answer.project_type as keyof typeof ProjectType] === 'spa-react') {
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
            if (ProjectType[answer.project_type as keyof typeof ProjectType] === 'toolkit') {
              return false;
            }
            return true;
          }
        },{
          name: 'lint',
          type: 'checkbox',
          choices: (answer: any) => {
            const lintArr = [ 'eslint', 'prettier', 'commitlint', 'stylelint' ];
            (answer.style === 'none' || ProjectType[answer.project_type as keyof typeof ProjectType] === 'toolkit') && lintArr.pop();
            return lintArr;
          },
          message: function (answer: any) {
            return `${logo()}[${++currStep}/${totalStep}] 选择lint工具 (Please select the lint tools)：`;
          },
          default: [ 'eslint' ]
        },{
          name: 'pkgtool',
          type: 'list',
          choices: [ 'yarn', 'npm', 'cnpm' ],
          when: function () {
            if (!install) return false;
            return true;
          },
          message: function (answer: any) {
            return `${logo()}[${++currStep}/${totalStep}] 请选择包安装工具，推荐使用yarn (Please choice the package install tool, recommended use yarn)：`;
          },
          default: 'yarn'
        }
      ];

      configFileExist = true;
      // if the config file non-existence，cancel double confirmation
      if (!fs.existsSync(configPath)) {
        questions.shift();
        configFileExist = false;
      }

      await new Promise((resolve) => {
        inquirer.prompt(questions)
          .then(async answers => {
            const {
              project_type,
              name,
              dev_server = 'docz',
              ts = true,
              test = true,
              style = [],
              lint = [],
              pkgtool = 'yarn'
            } = answers;

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
            const projectType = ProjectType[project_type as keyof typeof ProjectType];

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
              `stylelint=${stylelint}`,
              `devServer=${dev_server}`
            );

            switch (projectType) {
              case 'spa-react':
                tplPackage = '@omni-door/tpl-spa-react';
                break;
              case 'component-react':
                tplPackage = '@omni-door/tpl-component-react';
                break;
              case 'toolkit':
                tplPackage = '@omni-door/tpl-toolkit';
                break;
            }
            resolve();
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
    const initPath = customInitPath || path.resolve(process.cwd(), dirName);

    if (!configFileExist && await isDir(dirName)) {
      await new Promise((resolve) => {
        inquirer.prompt([{
          name: 'overwrite_dir',
          type: 'confirm',
          message: `${logo()} 真的确定要覆盖已经存在的 [${dirName}] 文件夹? (Are you sure to overwrite [${dirName}] directory?)`,
          default: false
        }]).then(answers => {
          const { overwrite_dir } = answers;
          if (!overwrite_dir) return process.exit(0);
          resolve();
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
          `npx ${tplPkj || tplPackage}@latest init ${arr2str([ ...tplParams, ...tplPkjParams ])}`
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