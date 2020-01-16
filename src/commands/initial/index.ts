import path, { parse } from 'path';
import fs from 'fs';
import fsExtra from 'fs-extra';
import shelljs from 'shelljs';
import chalk from 'chalk';
import figlet from 'figlet';
import inquirer from 'inquirer';
import ora from 'ora';
import {
  babel as babelConfigJs,
  bisheng as bishengConfigJs,
  commitlint as commitlintConfigJs,
  eslint as eslintrcJS,
  eslintignore,
  gitignore,
  jest as jestConfigJs,
  karma as karmaConfigJs,
  mdx,
  mocha as mochaOpts,
  npmignore,
  omni as omniConfigJs,
  pkj as packageJson,
  readme as readMe,
  stylelint as stylelintConfigJs,
  tsconfig as tsConfigJson,
  doczrc,
  posts_readme as postReadMe,
  source_index as indexTpl,
  source_index_react as indexReactTpl,
  source_html as indexHtml,
  source_d,
  storybook_addons,
  storybook_config,
  storybook_mhead,
  storybook_webpack,
  webpack_config_common,
  webpack_config_dev,
  webpack_config_prod
} from '../../templates';
import { dependencies, devDependencies } from '../../configs/dependencies';
import templates from '../../configs/initial_tpls';
import installClis from '../../configs/initial_clis';
import { logErr, logWarn } from '../../utils/logger';
import { execShell } from '../../utils/exec';
import { output_file } from '../../utils/output_file';
import getLogPrefix, { getLogo } from '../../utils/log_prefix';
import { 
  TPLS_INITIAL,
  TPLS_INITIAL_FN,
  TPLS_INITIAL_RETURE,
  BUILD,
  NPM,
  TESTFRAME,
  PKJTOOL,
  STYLE,
  DEVSERVER,
  PROJECT_TYPE,
  STRATEGY
} from '../../index.d';

export type GTpls = {
  name: string;
  project_type: PROJECT_TYPE;
  build: BUILD;
  ts: boolean;
  test: boolean;
  testFrame: TESTFRAME;
  eslint: boolean;
  commitlint: boolean;
  style: STYLE;
  stylelint: boolean;
  git: string;
  npm: NPM | '';
  devServer: DEVSERVER;
  createDir: boolean;
};

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
  devServer: DEVSERVER;
};

enum ProjectType {
  'react-spa (React单页应用)' = 'spa_react',
  'react-component-library (React组件库)' = 'component_library_react',
  'toolkit (工具库)' = 'toolkit'
}



const default_tpl_list = {
  babel: babelConfigJs,
  bisheng: bishengConfigJs,
  commitlint: commitlintConfigJs,
  eslint: eslintrcJS,
  eslintignore,
  gitignore,
  jest: jestConfigJs,
  karma: karmaConfigJs,
  mdx,
  mocha: mochaOpts,
  npmignore,
  omni: omniConfigJs,
  pkj: packageJson,
  readme: readMe,
  stylelint: stylelintConfigJs,
  tsconfig: tsConfigJson,
  doczrc,
  posts_readme: postReadMe,
  source_index: indexTpl,
  source_index_react: indexReactTpl,
  source_html: indexHtml,
  source_d,
  storybook_addons,
  storybook_config,
  storybook_mhead,
  storybook_webpack,
  webpack_config_common,
  webpack_config_dev,
  webpack_config_prod
};

export default function (strategy: STRATEGY, {
  simple,
  standard,
  entire,
  toolkit,
  components,
  custom
}: {
  simple?: boolean | string;
  standard?: boolean | string;
  entire?: boolean | string;
  toolkit?: boolean | string;
  components?: boolean | string;
  custom?: (tpls: TPLS_INITIAL) => any;
}, option?: {
  before?: (dirName: string) => {
    create_dir?: boolean;
    dir_name?: string;
    stdout?: boolean;
  };
  tpls?: (tpls: TPLS_INITIAL) => TPLS_INITIAL_RETURE;
  dependencies?: (dependecies_default: string[]) => string[];
  devDependencies?: (devDependecies_default: string[]) => string[];
  after?: () => {
    success?: boolean;
    msg?: string;
  };
  configFileName?: string;
}) {
  // initial spinner
  const spinner = ora(`${getLogPrefix()} 项目初始化中 (Initializing, please wait patiently)  💤  \n`);

  // reset illegal strategy
  strategy = (strategy === 'stable' || strategy === 'latest') ? strategy : 'stable';
  const { before, tpls, dependencies: dependencies_custom, devDependencies: devDependencies_custom, after, configFileName = 'omni.config.js' } = option || {};
  const { name: defaultName } = parse(process.cwd());
  const projectName =
    typeof simple === 'string'
      ? simple
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

  function generateTpls ({
    name,
    project_type,
    build,
    ts,
    test,
    testFrame,
    eslint,
    commitlint,
    style,
    stylelint,
    git,
    npm,
    devServer,
    createDir
  }: GTpls) {
    if (typeof create_dir === 'boolean' ? create_dir : createDir) {
      // mkdir
      initPath = path.resolve(process.cwd(), dir_name || name);
      fsExtra.ensureDirSync(initPath, {
        mode: 0o2777
      });
    }

    let custom_tpl_list = {};
    try {
      custom_tpl_list = typeof tpls === 'function'
        ? tpls(default_tpl_list)
        : custom_tpl_list;

      for (const tpl_name in custom_tpl_list) {
        const name = tpl_name as keyof TPLS_INITIAL_RETURE;
        const list = custom_tpl_list as TPLS_INITIAL_RETURE;
        const tpl = list[name];
        const tplFactory = (config: any) => {
          try {
            return tpl && tpl(config);
          } catch (err) {
            logWarn(JSON.stringify(err));
            logWarn(`自定义模板 [${name}] 解析出错，将使用默认模板进行初始化！(The custom template [${name}] parsing occured error, the default template will be used for initialization!)`);    
          }

          return default_tpl_list[name](config);
        };

        (list[name] as TPLS_INITIAL_FN) = tplFactory as TPLS_INITIAL_FN;
      }
    } catch (err_tpls) {
      logWarn(JSON.stringify(err_tpls));
      logWarn('生成自定义模板出错，将全部使用默认模板进行初始化！(The custom template generating occured error, all will be initializated with the default template!)');
    }
    const tpl = { ...default_tpl_list, ...custom_tpl_list };

    // switchers
    // whether or not react-spa project
    const isReactSPAProject = project_type === 'spa_react';
    const isToolkitProject = project_type === 'toolkit';
    // whether or not basic server
    const isBasicDevServer = devServer === 'basic';


    // default files
    const content_omni = tpl.omni({
      project_type,
      build,
      ts,
      test,
      testFrame,
      eslint,
      commitlint,
      style,
      stylelint,
      git,
      npm,
      mdx: devServer === 'docz'
    });
    const content_pkg = tpl.pkj({
      project_type,
      name,
      ts,
      devServer,
      testFrame,
      eslint,
      commitlint,
      stylelint
    });
    const content_gitignore = tpl.gitignore();
    const content_npmignore = tpl.npmignore();
    const content_indexTpl = tpl.source_index();
    const content_indexReactTpl = tpl.source_index_react({ build, devServer, project_type, ts });
    const content_indexHtml = tpl.source_html({ name });

    // tsconfig
    const content_ts = ts && tpl.tsconfig();

    // d.ts files
    const content_d = ts && tpl.source_d({ style });

    // test files
    const content_mocha = testFrame === 'mocha' && tpl.mocha({ ts });
    const content_karma = testFrame === 'mocha' && tpl.karma({ ts });
    const content_jest = testFrame === 'jest' && tpl.jest({ ts });

    // lint files
    const content_eslintrc = eslint && tpl.eslint({ project_type, ts });
    const content_eslintignore = eslint && tpl.eslintignore();
    const content_stylelint = stylelint && tpl.stylelint({ style });
    const content_commitlint = commitlint && tpl.commitlint({ name });

    // build files
    const content_babel = build && (build !== 'tsc' || devServer === 'storybook') && tpl.babel({ project_type, ts });

    // webpack config files
    const content_webpack_common = isBasicDevServer && tpl.webpack_config_common({ ts, style });
    const content_webpack_dev = isBasicDevServer && tpl.webpack_config_dev({ project_type, name, ts });
    const content_webpack_prod = isBasicDevServer && tpl.webpack_config_prod();

    // server files
    const content_bisheng = devServer === 'bisheng' && tpl.bisheng({ name, git });
    const content_postReadMe = devServer === 'bisheng' && tpl.posts_readme();
    const content_storybook_addons = devServer === 'storybook' && tpl.storybook_addons();
    const content_storybook_config = devServer === 'storybook' && tpl.storybook_config({ name });
    const content_storybook_mhead = devServer === 'storybook' && tpl.storybook_mhead({ name });
    const content_storybook_webpack = devServer === 'storybook' && tpl.storybook_webpack({ ts, style });
    const content_doczrc = devServer === 'docz' && tpl.doczrc({ name, ts, style });
    const content_doczmdx = devServer === 'docz' && tpl.mdx({ name });

    // ReadMe
    const content_readMe = tpl.readme({ name, configFileName });

    /**
     * create files
     */
    const file_path = (p: string) => path.resolve(initPath, p);
    // default files
    output_file({
      file_path: file_path(configFileName),
      file_content: content_omni
    });
    output_file({
      file_path: file_path('package.json'),
      file_content: content_pkg
    });
    output_file({
      file_path: file_path('.gitignore'),
      file_content: content_gitignore
    });
    output_file({
      file_path: file_path('.npmignore'),
      file_content: content_npmignore
    });

    // src dir files
    !isToolkitProject && !isReactSPAProject && output_file({
      file_path: file_path(`src/index.${ts ? 'tsx' : 'jsx'}`),
      file_content: content_indexTpl
    });
    isToolkitProject && output_file({
      file_path: file_path(`src/toolkit/index.${ts ? 'ts' : 'js'}`),
      file_content: content_indexTpl
    });
    isReactSPAProject && output_file({
      file_path: file_path(`src/index.${ts ? 'tsx' : 'jsx'}`),
      file_content: content_indexReactTpl
    });
    isReactSPAProject && output_file({
      file_path: file_path('src/index.html'),
      file_content: content_indexHtml
    });
    output_file({
      file_path: file_path('src/@types/global.d.ts'),
      file_content: content_d
    });
    output_file({
      file_path: file_path('src/index.mdx'),
      file_content: content_doczmdx
    });

    // webpack config files
    (isReactSPAProject || isToolkitProject) && output_file({
      file_path: file_path('configs/webpack.config.common.js'),
      file_content: content_webpack_common
    });
    (isReactSPAProject || isToolkitProject) && output_file({
      file_path: file_path('configs/webpack.config.dev.js'),
      file_content: content_webpack_dev
    });
    isReactSPAProject && output_file({
      file_path: file_path('configs/webpack.config.prod.js'),
      file_content: content_webpack_prod
    });

    // demo dir files
    if (isToolkitProject) {
      output_file({
        file_path: file_path(`demo/index.${ts ? 'tsx' : 'jsx'}`),
        file_content: content_indexReactTpl
      });
      output_file({
        file_path: file_path('demo/index.html'),
        file_content: content_indexHtml
      });
    }

    // tsconfig
    output_file({
      file_path: file_path('tsconfig.json'),
      file_content: content_ts
    });
    
    // test files
    output_file({
      file_path: file_path('mocha.opts'),
      file_content: content_mocha
    });
    output_file({
      file_path: file_path('karma.conf.js'),
      file_content: content_karma
    });
    output_file({
      file_path: file_path('jest.config.js'),
      file_content: content_jest
    });

    // lint files
    output_file({
      file_path: file_path('.eslintrc.js'),
      file_content: content_eslintrc
    });
    output_file({
      file_path: file_path('.eslintignore'),
      file_content: content_eslintignore
    });
    output_file({
      file_path: file_path('stylelint.config.js'),
      file_content: content_stylelint
    });
    output_file({
      file_path: file_path('commitlint.config.js'),
      file_content: content_commitlint
    });

    // build files
    output_file({
      file_path: file_path('babel.config.js'),
      file_content: content_babel
    });

    // dev-server files
    output_file({
      file_path: file_path('bisheng.config.js'),
      file_content: content_bisheng
    });
    output_file({
      file_path: file_path('posts/README.md'),
      file_content: content_postReadMe
    });
    output_file({
      file_path: file_path('.storybook/addons.js'),
      file_content: content_storybook_addons
    });
    output_file({
      file_path: file_path('.storybook/config.js'),
      file_content: content_storybook_config
    });
    output_file({
      file_path: file_path('.storybook/manager-head.html'),
      file_content: content_storybook_mhead
    });
    output_file({
      file_path: file_path('.storybook/webpack.config.js'),
      file_content: content_storybook_webpack
    });
    output_file({
      file_path: file_path('doczrc.js'),
      file_content: content_doczrc
    });

    // ReadMe
    output_file({
      file_path: file_path('README.md'),
      file_content: content_readMe
    });
  }

  async function generateInstallDenpendencies ({
    project_type,
    pkgtool,
    build,
    ts,
    eslint,
    commitlint,
    style,
    stylelint,
    testFrame,
    devServer
  }: GInstallCli) {
    await checkPkgTool(pkgtool);

    let installCliPrefix = pkgtool === 'yarn' ? `${pkgtool} add --cwd ${initPath}` : `${pkgtool} install --save --prefix ${initPath}`;

    let installDevCliPrefix = pkgtool === 'yarn' ? `${pkgtool} add -D --cwd ${initPath}` : `${pkgtool} install --save-dev --prefix ${initPath}`;
    if (pkgtool === 'cnpm' && initPath !== process.cwd()) {
      installCliPrefix = `cd ${initPath} && ${installCliPrefix}`;
      installDevCliPrefix = `cd ${initPath} && ${installDevCliPrefix}`;
    }

    const {
      depArr,
      depStr
    } = dependencies(strategy, {
      project_type,
      build,
      ts,
      eslint,
      commitlint,
      style,
      stylelint,
      testFrame,
      devServer
    });
    const dependencies_custom_arr = typeof dependencies_custom === 'function' ? dependencies_custom(depArr).join(' ').trim() : '';
    const installCli = (dependencies_custom_arr || depStr) ? `${installCliPrefix} ${depStr} ${dependencies_custom_arr}` : '';

    const { defaultDep, buildDep, tsDep, testDep, eslintDep, commitlintDep, stylelintDep, devServerDep, depArr: devDepArr } = devDependencies(strategy, {
      project_type,
      build,
      ts,
      eslint,
      commitlint,
      style,
      stylelint,
      testFrame,
      devServer
    });
    const devDependencies_default = [...devDepArr ]; 
    const installDevCli = defaultDep ? `${installDevCliPrefix} ${defaultDep}` : '';
    const installBuildDevCli = buildDep ? `${installDevCliPrefix} ${buildDep}` : '';
    const installTsDevCli = tsDep ? `${installDevCliPrefix} ${tsDep}` : '';
    const installTestDevCli = testDep ? `${installDevCliPrefix} ${testDep}` : '';
    const installEslintDevCli = eslintDep ? `${installDevCliPrefix} ${eslintDep}` : '';
    const installCommitlintDevCli = commitlintDep ? `${installDevCliPrefix} ${commitlintDep}` : '';
    const installStylelintDevCli = stylelintDep ? `${installDevCliPrefix} ${stylelintDep}` : '';
    const installServerDevCli = devServerDep ? `${installDevCliPrefix} ${devServerDep}` : '';
    const installCustomDevCli = typeof devDependencies_custom === 'function' ? `${installDevCliPrefix} ${devDependencies_custom(devDependencies_default).join(' ')}` : '';

    return {
      installCli,
      installDevCli,
      installBuildDevCli,
      installTsDevCli,
      installTestDevCli,
      installEslintDevCli,
      installCommitlintDevCli,
      installStylelintDevCli,
      installServerDevCli,
      installCustomDevCli
    };
  }

  function generateFiglet (fn: (done: () => void) => any) {
    return figlet('@OMNI-DOOR/CLI', function (err, data) {
      if (err) {
        logErr(JSON.stringify(err));
        spinner.fail(chalk.yellow(`${getLogPrefix()} figlet 出现了问题！(Some thing about figlet is wrong!)  ❌  \n`));
      }

      return fn(function () {
        const afterRes = typeof after === 'function' && after();
        const { success, msg } = afterRes || {};
  
        if (success === false) {
          spinner.fail(chalk.red(`${getLogPrefix()} ${msg || '初始化项目失败 (Initialize project failed)'}  ❌  \n`));
        } else {
          spinner.succeed(chalk.green(`${getLogPrefix()} ${msg || '初始化项目完成 (Initialize project success)'}  ✅  \n`));
        }
  
        data && console.info(chalk.yellow(data));
        process.exit(0);
      });
    });
  }

  async function presetTpl (createDir: boolean) {
    let cli, tpl;
    if (simple) {
      cli = installClis.cli_simple;
      tpl = templates.tpl_simple;
    } else if (standard) {
      cli = installClis.cli_standard;
      tpl = templates.tpl_standard;
    } else if (entire) {
      cli = installClis.cli_entire;
      tpl = templates.tpl_entire;
    } else if (toolkit) {
      cli = installClis.cli_lib_toolkit;
      tpl = templates.tpl_lib_toolkit;
    } else if (components) {
      cli = installClis.cli_lib_components;
      tpl = templates.tpl_lib_components;
    }

    try {
      generateTpls(Object.assign(tpl, { name: projectName, createDir }));

      const {
        installCli,
        installDevCli,
        installBuildDevCli,
        installTsDevCli,
        installTestDevCli,
        installEslintDevCli,
        installCommitlintDevCli,
        installStylelintDevCli,
        installServerDevCli,
        installCustomDevCli
      } = await generateInstallDenpendencies(cli as GInstallCli);

      generateFiglet((done) => execShell([
        installCli,
        installDevCli,
        installBuildDevCli,
        installTsDevCli,
        installTestDevCli,
        installEslintDevCli,
        installCommitlintDevCli,
        installStylelintDevCli,
        installServerDevCli,
        installCustomDevCli
      ], done, err => process.exit(1), isSilent));

      // loading start display
      spinner.start();
    } catch (err) {
      logErr(JSON.stringify(err));
      spinner.fail(chalk.red(`${getLogPrefix()} 安装依赖发生错误！(The installation of dependencies occurred some accidents!)  ❌  \n`));
    }
  }

  async function checkPkgTool (pkgtool: PKJTOOL) {
    // install tool precheck
    return new Promise((resolve, reject) => {
      let iToolCheck = shelljs.exec(`${pkgtool} -v`, { async: false });

      if (~iToolCheck.stderr.indexOf('command not found')) {
        if (pkgtool === 'npm') {
          logWarn('没有找到 npm 包管理工具！(Cannot found the npm package management tool!)');
          process.exit(0);
        } else {
          spinner.info(chalk.yellowBright(`${getLogPrefix()} 缺少包管理工具 ${pkgtool}！(Missing package management tool ${pkgtool}!)  🔰  \n`));
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
            spinner.start();
            resolve(true);
          });
        }
      } else {
        resolve(true);
      }
    });
  }

  if (typeof custom === 'function') {
    return custom(default_tpl_list);
  } else if (simple || standard || entire || toolkit || components) {
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
    const questions = [
      {
        name: 'overwrite',
        type: 'confirm',
        message: `${getLogo()} 确定要覆盖已经存在的 [${configFileName}] 文件? (Are you sure to overwrite [${configFileName}]?)`,
        default: false
      },{
        name: 'name',
        type: 'input',
        message: `${getLogo()}[1/7] 请输入项目名称 (please enter your project name)：`,
        when: function (answer: any) {
          if (answer.overwrite === false) {
            return process.exit(0);
          }
          return true;
        },
        default: defaultName
      },{
        name: 'project_type',
        type: 'list',
        choices: [ 'react-spa (React单页应用)', 'react-component-library (React组件库)', 'toolkit (工具库)' ],
        message: `${getLogo()}[2/7] 请选择项目类型 (please choose the type of project)：`
      },{
        name: 'dev_server',
        type: 'list',
        choices: [ 'docz', 'storybook', 'bisheng' ],
        default: 'docz',
        message: `${getLogo()}[2/7] 请选择组件库Demo框架 (please chioce the component-library demonstration frame)：`,
        when: function (answer: any) {
          if (ProjectType[answer.project_type as keyof typeof ProjectType] === 'component_library_react') {
            return true;
          }
          return false;
        }
      },{
        name: 'ts',
        type: 'confirm',
        message: `${getLogo()}[3/7] 是否使用typescript? (whether or not apply typescript?)`,
        default: true,
        when: function (answer: any) {
          if (ProjectType[answer.project_type as keyof typeof ProjectType] === 'spa_react') {
            return true;
          }
          return false;
        }
      },{
        name: 'test',
        type: 'confirm',
        message: `${getLogo()}[4/7] 是否开启单元测试? (whether or not apply unit-test?)`,
        default: (answer: any) => ProjectType[answer.project_type as keyof typeof ProjectType] !== 'spa_react',
        when: function (answer: any) {
          if (ProjectType[answer.project_type as keyof typeof ProjectType] === 'spa_react') {
            return true;
          }
          return false;
        }
      },{
        name: 'style',
        type: 'list',
        choices: [ 'less', 'scss', 'css', 'all', 'none' ],
        message: `${getLogo()}[5/7] 应用哪种样式文件? (which the stylesheet type you like applying?)`,
        default: 'less',
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
        message: `${getLogo()}[6/7] 选择lint工具 (select the lint tool)：`,
        default: [ 'eslint' ]
      },{
        name: 'pkgtool',
        type: 'list',
        choices: [ 'yarn', 'npm', 'cnpm' ],
        message: `${getLogo()}[7/7] 请选择包安装工具，推荐使用yarn (please chioce the package install tool, recommended use yarn)：`,
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
      spinner.warn(chalk.yellow(`${getLogPrefix()} ${JSON.stringify(err)}  ❗️  \n`));
    }

    inquirer.prompt(questions)
      .then(async answers => {
        const {
          name,
          project_type,
          dev_server = 'basic',
          ts = true,
          test = false,
          style = 'none',
          lint = [],
          pkgtool = 'yarn'
        } = answers;

        const eslint = !!~lint.indexOf('eslint');
        const commitlint = !!~lint.indexOf('commitlint');
        const stylelint = !!~lint.indexOf('stylelint');
        const stylesheet = style === 'none' ? '' : style;
        const projectType = ProjectType[project_type as keyof typeof ProjectType];
        const testFrame: TESTFRAME = test
          ? projectType === 'toolkit'
            ? 'mocha'
            : 'jest'
          : '';
        const build = projectType === 'spa_react'
          ? 'webpack'
          : projectType === 'toolkit'
            ? 'rollup'
            : projectType === 'component_library_react'
              ? 'tsc'
              : 'webpack';

        generateTpls({
          createDir,
          project_type: projectType,
          name,
          build,
          ts,
          test,
          testFrame,
          eslint,
          commitlint,
          style: stylesheet,
          stylelint,
          git: '',
          npm: '',
          devServer: dev_server
        });

        const {
          installCli,
          installDevCli,
          installBuildDevCli,
          installTsDevCli,
          installTestDevCli,
          installEslintDevCli,
          installCommitlintDevCli,
          installStylelintDevCli,
          installServerDevCli,
          installCustomDevCli
        } = await generateInstallDenpendencies({
          project_type: projectType,
          pkgtool,
          build,
          ts,
          eslint,
          commitlint,
          style: stylesheet,
          stylelint,
          testFrame,
          devServer: dev_server === 'none' ? '' : dev_server
        });


        generateFiglet((done) => execShell([
          installCli,
          installDevCli,
          installBuildDevCli,
          installTsDevCli,
          installTestDevCli,
          installEslintDevCli,
          installCommitlintDevCli,
          installStylelintDevCli,
          installServerDevCli,
          installCustomDevCli
        ], done, err => process.exit(1), isSilent));

        // loading start display
        spinner.start();
      })
      .catch(err => {
        logErr(JSON.stringify(err));
        spinner.fail(chalk.red(`${getLogPrefix()} 安装依赖发生错误！(The installation of dependencies occurred some accidents!)  ❌  \n`));
        process.exit(1);
      });
  }
}