import path, { parse } from 'path';
import fs from 'fs';
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
} from '@omni-door/tpl-utils';
import logo from '../../utils/logo';



enum ProjectType {
  'spa-react (React单页应用)' = 'spa-react',
  'component-library-react (React组件库)' = 'component-library-react',
  'toolkit (工具库)' = 'toolkit'
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
          message: `${logo} 自动安装 ${pkgtool} 到全局环境? (Automatic install the ${pkgtool} in the global environment?)`,
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

function presetTpl (type: 'basic' | 'standard' | 'entire' | 'toolkit' | 'components') {
  let cli, pkj = '';
  switch(type) {
    case 'basic':
      cli = presetCli.cli_basic;
      pkj = '@omni-door/tpl-spa-react';
      break;
    case 'standard':
      cli = presetCli.cli_standard;
      pkj = '@omni-door/tpl-spa-react';
      break;
    case 'entire':
      cli = presetCli.cli_entire;
      pkj = '@omni-door/tpl-spa-react';
      break;
    case 'toolkit':
      cli = presetCli.cli_lib_toolkit;
      pkj = '@omni-door/tpl-toolkit';
      break;
    case 'components':
      cli = presetCli.cli_lib_components;
      pkj = '@omni-door/tpl-component-library-react';
  }

  return { cli, pkj };
}

type OptionType = {
  basic?: boolean | string;
  standard?: boolean | string;
  entire?: boolean | string;
  toolkit?: boolean | string;
  components?: boolean | string;
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
  configFileName?: string;
};

export default async function (strategy: STRATEGY, {
  basic,
  standard,
  entire,
  toolkit,
  components
}: OptionType, option?: OptionCustom) {
  try {
    // node version pre-check
    await node_version('10.13.0');
  } catch (err) {
    logWarn(err);
  }

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
    configFileName = 'omni.config.js'
  } = option || {};


  const tplParams: string[] = [ ...tplPkjParams ];
  const configPath = path.resolve(configFileName);

  // get project name
  const { name: defaultName } = parse(process.cwd());
  let presetType: keyof typeof types | '' = '';
  let projectName = defaultName;
  const types = {
    basic,
    standard,
    entire,
    toolkit,
    components
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
            message: `${logo} 确定要覆盖已经存在的 [${configFileName}] 文件? (Are you sure to overwrite [${configFileName}]?)`,
            default: false
          }]).then(answers => {
            const { overwrite } = answers;
            if (!overwrite) return process.exit(0);
            resolve();
          });
        }).catch(err => {
          logErr(JSON.stringify(err));
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
      const questions = [
        {
          name: 'overwrite',
          type: 'confirm',
          message: `${logo} 确定要覆盖已经存在的 [${configFileName}] 文件? (Are you sure to overwrite [${configFileName}]?)`,
          default: false
        },{
          name: 'project_type',
          type: 'list',
          choices: [ 'spa-react (React单页应用)', 'component-library-react (React组件库)', 'toolkit (工具库)' ],
          message: `${logo}[${currStep}/${totalStep}] 请选择项目类型 (Please choose the type of project)：`,
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
              totalStep = 7;
            } else if (ProjectType[answer.project_type as keyof typeof ProjectType] === 'component-library-react') {
              totalStep = 6;
            } else {
              totalStep = 4;
            }
            return `${logo}[${++currStep}/${totalStep}] 请输入项目名称 (Please enter your project name)：`;
          },
          default: defaultName
        },{
          name: 'dev_server',
          type: 'list',
          choices: [ 'docz', 'storybook', 'bisheng' ],
          default: 'docz',
          message: function (answer: any) {
            return `${logo}[${++currStep}/${totalStep}] 请选择组件库Demo框架 (Please chioce the component-library demonstration frame)：`;
          },
          when: function (answer: any) {
            if (ProjectType[answer.project_type as keyof typeof ProjectType] === 'component-library-react') {
              return true;
            }
            return false;
          }
        },{
          name: 'ts',
          type: 'confirm',
          message: function (answer: any) {
            return `${logo}[${++currStep}/${totalStep}] 是否使用typescript? (Whether or not apply typescript?)`;
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
            return `${logo}[${++currStep}/${totalStep}] 是否开启单元测试? (Whether or not apply unit-test?)`;
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
            return `${logo}[${++currStep}/${totalStep}] 选择样式文件 (Please select the stylesheets)`;
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
            return `${logo}[${++currStep}/${totalStep}] 选择lint工具 (Please select the lint tools)：`;
          },
          default: [ 'eslint' ]
        },{
          name: 'pkgtool',
          type: 'list',
          choices: [ 'yarn', 'npm', 'cnpm' ],
          message: function (answer: any) {
            return `${logo}[${++currStep}/${totalStep}] 请选择包安装工具，推荐使用yarn (Please choice the package install tool, recommended use yarn)：`;
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
              dev_server = 'basic',
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
              `devServer=${dev_server === 'none' ? '' : dev_server}`
            );

            switch (projectType) {
              case 'spa-react':
                tplPackage = '@omni-door/tpl-spa-react';
                break;
              case 'component-library-react':
                tplPackage = '@omni-door/tpl-component-library-react';
                break;
              case 'toolkit':
                tplPackage = '@omni-door/tpl-toolkit';
                break;
            }
            resolve();
          });
      }).catch(err => {
        logErr(JSON.stringify(err));
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
    const initPath = path.resolve(process.cwd(), dir_name || projectName);
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
        logErr(JSON.stringify(err));
        spinner.state('fail', 'figlet 出现了问题！(Some thing about figlet is wrong!)');
      }
  
      

      

      return exec(
        [
          `npx ${tplPkj || tplPackage}@latest init ${arr2str(tplParams)}`
        ],
        async function () {
          const afterRes = typeof after === 'function' && await after();
          const { success, msg } = afterRes || {};
    
          if (success === false) {
            spinner.state('fail', msg || '初始化项目失败 (Initialize project failed)');
          } else {
            spinner.state('succeed', msg || '初始化项目完成 (Initialize project success)');
          }
    
          data && console.info(chalk.yellow(data));
          process.exit(0);
        },
        async function (err: any) {
          logErr(err);
          spinner.state('fail', '初始化项目失败 (Initialize project failed)');
          process.exit(1);
        }
      );
    });
  } catch (err) {
    logErr(JSON.stringify(err));
    spinner.state('fail', '项目初始化发生错误！(The initializing occurred some accidents!)');
  }
}