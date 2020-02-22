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
  getLogo,
  getBrand,
  node_version,
  BUILD,
  TESTFRAME,
  PKJTOOL,
  STYLE,
  DEVSERVER,
  PROJECT_TYPE,
  STRATEGY
} from '@omni-door/tpl-utils';

export type GInstallCli = {
  project_type: PROJECT_TYPE;
  pkgtool: PKJTOOL;
  build: BUILD;
  ts: boolean;
  testFrame: TESTFRAME;
  eslint: boolean;
  commitlint: boolean;
  style: STYLE;
  stylelint: boolean;
  devServer?: DEVSERVER;
};

enum ProjectType {
  'spa-react (React单页应用)' = 'spa-react',
  'component-library-react (React组件库)' = 'component-library-react',
  'toolkit (工具库)' = 'toolkit'
}

export type ResultOfDependencies = string[] | { add?: string[]; remove?: string[]; };
export type TPLS_INITIAL = { [tpl: string]: (config: { [param: string]: string | boolean}) => string };
export type TPLS_INITIAL_RETURE = Partial<TPLS_INITIAL>;

export default async function (strategy: STRATEGY, {
  basic,
  standard,
  entire,
  toolkit,
  components
}: {
  basic?: boolean | string;
  standard?: boolean | string;
  entire?: boolean | string;
  toolkit?: boolean | string;
  components?: boolean | string;
}, option?: {
  before?: (dirName: string) => {
    create_dir?: boolean;
    dir_name?: string;
    stdout?: boolean;
  };
  after?: () => {
    success?: boolean;
    msg?: string;
  };
  tpls?: (tpls: TPLS_INITIAL) => TPLS_INITIAL_RETURE;
  dependencies?: (dependecies_default: string[]) => ResultOfDependencies;
  devDependencies?: (devDependecies_default: string[]) => ResultOfDependencies;
  configFileName?: string;
}) {
  try {
    // node version pre-check
    await node_version('10.13.0');
  } catch (err) {
    logWarn(err);
  }

  spinner.color('green');
  spinner.prefix('arrow3');

  // reset illegal strategy
  strategy = (strategy === 'stable' || strategy === 'latest') ? strategy : 'stable';
  const { before, after, configFileName = 'omni.config.js' } = option || {};
  const { name: defaultName } = parse(process.cwd());
  const projectName =
    typeof basic === 'string'
      ? basic
      : typeof standard === 'string'
        ? standard
        : typeof entire === 'string'
          ? entire
          : typeof toolkit === 'string'
            ? toolkit
            : typeof components === 'string'
              ? components
              : defaultName;

  const configPath = path.resolve(configFileName);
  let initPath = process.cwd();

  const beforeRes = typeof before === 'function' && before(projectName);
  const {
    create_dir,
    dir_name,
    stdout
  } = beforeRes || {};
  const isSilent = typeof stdout === 'boolean' ? !stdout : false;

  if (basic || standard || entire || toolkit || components) {
    if (fs.existsSync(configPath)) {
      // double confirmation
      inquirer.prompt([{
        name: 'overwrite',
        type: 'confirm',
        message: `${getLogo()} 确定要覆盖已经存在的 [${configFileName}] 文件? (Are you sure to overwrite [${configFileName}]?)`,
        default: false
      }]).then(answers => {
        const { overwrite } = answers;
        if (!overwrite) {
          return process.exit(0);
        }
        presetTpl(false);
      });
    } else {
      presetTpl(true);
    }
  } else {
    let currStep = 1;
    let totalStep: string | number = '?';
    const questions = [
      {
        name: 'overwrite',
        type: 'confirm',
        message: `${getLogo()} 确定要覆盖已经存在的 [${configFileName}] 文件? (Are you sure to overwrite [${configFileName}]?)`,
        default: false
      },{
        name: 'project_type',
        type: 'list',
        choices: [ 'spa-react (React单页应用)', 'component-library-react (React组件库)', 'toolkit (工具库)' ],
        message: `${getLogo()}[${currStep}/${totalStep}] 请选择项目类型 (please choose the type of project)：`,
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
          return `${getLogo()}[${++currStep}/${totalStep}] 请输入项目名称 (please enter your project name)：`;
        },
        default: defaultName
      },{
        name: 'dev_server',
        type: 'list',
        choices: [ 'docz', 'storybook', 'bisheng' ],
        default: 'docz',
        message: function (answer: any) {
          return `${getLogo()}[${++currStep}/${totalStep}] 请选择组件库Demo框架 (please chioce the component-library demonstration frame)：`;
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
          return `${getLogo()}[${++currStep}/${totalStep}] 是否使用typescript? (whether or not apply typescript?)`;
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
          return `${getLogo()}[${++currStep}/${totalStep}] 是否开启单元测试? (whether or not apply unit-test?)`;
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
          return `${getLogo()}[${++currStep}/${totalStep}] 选择样式文件 (select the stylesheets)`;
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
          const lintArr = [ 'eslint', 'commitlint', 'stylelint' ];
          (answer.style === 'none' || ProjectType[answer.project_type as keyof typeof ProjectType] === 'toolkit') && lintArr.pop();
          return lintArr;
        },
        message: function (answer: any) {
          return `${getLogo()}[${++currStep}/${totalStep}] 选择lint工具 (select the lint tools)：`;
        },
        default: [ 'eslint' ]
      },{
        name: 'pkgtool',
        type: 'list',
        choices: [ 'yarn', 'npm', 'cnpm' ],
        message: function (answer: any) {
          return `${getLogo()}[${++currStep}/${totalStep}] 请选择包安装工具，推荐使用yarn (please choice the package install tool, recommended use yarn)：`;
        },
        default: 'yarn'
      }
    ];

    let createDir = false;
    try {
      // if the config file non-existence，cancel double confirmation
      if (!fs.existsSync(configPath)) {
        questions.shift();
        createDir = true;
      }
    } catch (err) {
      logWarn(JSON.stringify(err));
    }

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

        // create the folder
        mkdir({
          createDir,
          name
        });

        const params = [
          `projectName=${name}`,
          `strategy=${strategy}`,
          `initPath=${initPath}`,
          `project_type=${projectType}`,
          `pkgtool=${pkgtool}`,
          `ts=${ts}`,
          `test=${test}`,
          `eslint=${eslint}`,
          `commitlint=${commitlint}`,
          `style=${stylesheet}`,
          `stylelint=${stylelint}`,
          `devServer=${dev_server === 'none' ? '' : dev_server}`,
          `isSilent=${isSilent}`
        ];

        let tplPackage = '';
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

        // loading start display
        spinner.state('start', '项目初始化中 (Initializing, please wait patiently)');
        logFiglet((done) => exec([
          `npx ${tplPackage}@latest init ${arr2str(params)}`
        ], done, err => process.exit(1)));
      })
      .catch(err => {
        logErr(JSON.stringify(err));
        spinner.state('fail', '项目初始化发生错误！(The initializing occurred some accidents!)');
        process.exit(1);
      });
  }

  function mkdir ({
    name,
    createDir
  }: {
    name: string;
    createDir: boolean;
  }) {
    if (typeof create_dir === 'boolean' ? create_dir : createDir) {
      // mkdir
      initPath = path.resolve(process.cwd(), dir_name || name);
      fsExtra.ensureDirSync(initPath, {
        mode: 0o2777
      });
    }
  }

  function logFiglet (fn: (done: () => void) => any) {
    return figlet(getBrand(), function (err, data) {
      if (err) {
        logErr(JSON.stringify(err));
        spinner.state('fail', 'figlet 出现了问题！(Some thing about figlet is wrong!)');
      }

      return fn(function () {
        const afterRes = typeof after === 'function' && after();
        const { success, msg } = afterRes || {};
  
        if (success === false) {
          spinner.state('fail', msg || '初始化项目失败 (Initialize project failed)');
        } else {
          spinner.state('succeed', msg || '初始化项目完成 (Initialize project success)');
        }
  
        data && console.info(chalk.yellow(data));
        process.exit(0);
      });
    });
  }

  async function presetTpl (createDir: boolean) {
    let cli, tplPackage: string;
    if (basic) {
      cli = presetCli.cli_basic;
      tplPackage = '@omni-door/tpl-spa-react';
    } else if (standard) {
      cli = presetCli.cli_standard;
      tplPackage = '@omni-door/tpl-spa-react';
    } else if (entire) {
      cli = presetCli.cli_entire;
      tplPackage = '@omni-door/tpl-spa-react';
    } else if (toolkit) {
      cli = presetCli.cli_lib_toolkit;
      tplPackage = '@omni-door/tpl-toolkit';
    } else if (components) {
      cli = presetCli.cli_lib_components;
      tplPackage = '@omni-door/tpl-component-library-react';
    }

    const params: string[] = [ `projectName=${projectName}`, `strategy=${strategy}`, `initPath=${initPath}`, `isSilent=${isSilent}` ];
    for (const k in cli) {
      params.push(`${k}=${cli[k as keyof typeof cli]}`);
    }
    try {
      await checkPkgTool(cli ? cli.pkgtool : 'yarn');
      // create the folder
      mkdir({ name: projectName, createDir });

      spinner.state('start', '项目初始化中 (Initializing, please wait patiently)');
      logFiglet((done) => exec([
        `npx ${tplPackage}@latest init ${arr2str(params)}`
      ], done, err => process.exit(1)));
    } catch (err) {
      logErr(JSON.stringify(err));
      spinner.state('fail', '项目初始化发生错误！(The initializing occurred some accidents!)');
    }
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
            message: `${getLogo()} 自动安装 ${pkgtool} 到全局环境? (Automatic install the ${pkgtool} in the global environment?)`,
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
}