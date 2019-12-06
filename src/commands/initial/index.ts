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
  server_index as serverTpl,
  server_webpack as webpackDevConfigJs,
  source_index as indexTpl,
  source_index_react as indexReactTpl,
  source_html as indexHtml,
  source_d,
  storybook_addons,
  storybook_config,
  storybook_mhead,
  storybook_webpack
} from '../../templates';
import { dependencies, devDependencies } from '../../configs/dependencies';
import templates from '../../configs/initial_tpls';
import installClis from '../../configs/initial_clis';
import { BUILD, NPM, TESTFRAME, PKJTOOL, STYLE, DEVSERVER, PROJECT_TYPE } from '../../index.d';
import { logErr, logWarn } from '../../utils/logger';
import { execShell } from '../../utils/exec';

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
  cdn: string;
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

const spinner = ora('🐸  [OMNI-DOOR] 📡  : 项目初始化中 (Initializing, please wait patiently)  💤  \n');

export default function ({
  simple,
  standard,
  entire,
  utils,
  components
}: {
  simple?: boolean | string;
  standard?: boolean | string;
  entire?: boolean | string;
  utils?: boolean | string;
  components?: boolean | string;
}) {
  const { name: defaultName } = parse(process.cwd());
  const projectName =
    typeof simple === 'string'
      ? simple
      : typeof standard === 'string'
        ? standard
        : typeof entire === 'string'
          ? entire
          : typeof utils === 'string'
            ? utils
            : typeof components === 'string'
              ? components
              : defaultName;

  const omniConfigPath = path.resolve('omni.config.js');
  let initPath = process.cwd();

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
    cdn,
    devServer,
    createDir
  }: GTpls) {
    if (createDir) {
      // mkdir
      initPath = path.resolve(process.cwd(), name);
      fsExtra.ensureDirSync(initPath, {
        mode: 0o2777
      });
    }

    // whether or not react-spa project
    const isReactSPAProject = project_type === 'spa_react';

    // default files
    const content_omni = omniConfigJs({
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
      cdn,
      mdx: devServer === 'docz'
    });
    const content_pkg = packageJson({
      name,
      ts,
      devServer,
      testFrame,
      eslint,
      commitlint,
      stylelint
    });
    const content_gitignore = gitignore();
    const content_npmignore = npmignore();
    const content_indexTpl = indexTpl();
    const content_indexReactTpl = indexReactTpl({ build, devServer, project_type });
    const content_indexHtml = indexHtml({ name });

    // tsconfig
    const content_ts = ts && tsConfigJson();

    // d.ts files
    const content_d = ts && source_d({ style });

    // test files
    const content_mocha = testFrame === 'mocha' && mochaOpts({ ts });
    const content_karma = testFrame === 'karma' && karmaConfigJs({ ts });
    const content_jest = testFrame === 'jest' && jestConfigJs({ ts });

    // lint files
    const content_eslintrc = eslint && eslintrcJS({ ts });
    const content_eslintignore = eslint && eslintignore();
    const content_stylelint = stylelint && stylelintConfigJs({ style });
    const content_commitlint = commitlint && commitlintConfigJs({ name });

    // build files
    const content_babel = build && build !== 'tsc' && babelConfigJs({ project_type, ts });

    // server files
    const content_bisheng = devServer === 'bisheng' && bishengConfigJs({ name, git });
    const content_postReadMe = devServer === 'bisheng' && postReadMe();
    const content_serverTpl = devServer === 'basic' && serverTpl();
    const content_webpackDev = devServer === 'basic' && webpackDevConfigJs({ project_type, name, ts, style });
    const content_storybook_addons = devServer === 'storybook' && storybook_addons();
    const content_storybook_config = devServer === 'storybook' && storybook_config({ name });
    const content_storybook_mhead = devServer === 'storybook' && storybook_mhead({ name });
    const content_storybook_webpack = devServer === 'storybook' && storybook_webpack({ ts, style });
    const content_doczrc = devServer === 'docz' && doczrc({ name, ts, style });
    const content_doczmdx = devServer === 'docz' && mdx({ name });

    // ReadMe
    const content_readMe = readMe({ name });

    /**
     * create files
     */

    // default files
    fsExtra.outputFileSync(path.resolve(initPath, 'omni.config.js'), content_omni, 'utf8');
    fsExtra.outputFileSync(path.resolve(initPath, 'package.json'), content_pkg, 'utf8');
    fsExtra.outputFileSync(path.resolve(initPath, '.gitignore'), content_gitignore, 'utf8');
    fsExtra.outputFileSync(path.resolve(initPath, '.npmignore'), content_npmignore, 'utf8');

    // src dir files
    !isReactSPAProject && fsExtra.outputFileSync(path.resolve(initPath, `src/index.${ts ? 'tsx' : 'jsx'}`), content_indexTpl, 'utf8');
    isReactSPAProject && fsExtra.outputFileSync(path.resolve(initPath, `src/index.${ts ? 'tsx' : 'jsx'}`), content_indexReactTpl, 'utf8');
    isReactSPAProject && fsExtra.outputFileSync(path.resolve(initPath, 'src/index.html'), content_indexHtml, 'utf8');
    content_d && fsExtra.outputFileSync(path.resolve(initPath, 'src/@types/global.d.ts'), content_d, 'utf8');
    content_doczmdx && fsExtra.outputFileSync(path.resolve(initPath, 'src/index.mdx'), content_doczmdx, 'utf8');

    // demo dir files
    !isReactSPAProject && fsExtra.outputFileSync(path.resolve(initPath, `demo/index.${ts ? 'tsx' : 'jsx'}`), content_indexReactTpl, 'utf8');
    !isReactSPAProject && fsExtra.outputFileSync(path.resolve(initPath, 'demo/index.html'), content_indexHtml, 'utf8');
    !isReactSPAProject && content_serverTpl && fsExtra.outputFileSync(path.resolve(initPath, 'demo/server/index.js'), content_serverTpl, 'utf8');
    !isReactSPAProject && content_webpackDev && fsExtra.outputFileSync(path.resolve(initPath, 'demo/server/webpack.config.dev.js'), content_webpackDev, 'utf8');

    // tsconfig
    content_ts && fsExtra.outputFileSync(path.resolve(initPath, 'tsconfig.json'), content_ts, 'utf8');
    
    // test files
    content_mocha && fsExtra.outputFileSync(path.resolve(initPath, 'mocha.opts'), content_mocha, 'utf8');
    content_karma && fsExtra.outputFileSync(path.resolve(initPath, 'karma.conf.js'), content_karma, 'utf8');
    content_jest && fsExtra.outputFileSync(path.resolve(initPath, 'jest.config.js'), content_jest, 'utf8');

    // lint files
    content_eslintrc && fsExtra.outputFileSync(path.resolve(initPath, '.eslintrc.js'), content_eslintrc, 'utf8');
    content_eslintignore && fsExtra.outputFileSync(path.resolve(initPath, '.eslintignore'), content_eslintignore, 'utf8');
    content_stylelint && fsExtra.outputFileSync(path.resolve(initPath, 'stylelint.config.js'), content_stylelint, 'utf8');
    content_commitlint && fsExtra.outputFileSync(path.resolve(initPath, 'commitlint.config.js'), content_commitlint, 'utf8');

    // build files
    content_babel && fsExtra.outputFileSync(path.resolve(initPath, 'babel.config.js'), content_babel, 'utf8');

    // dev-server files
    content_bisheng && fsExtra.outputFileSync(path.resolve(initPath, 'bisheng.config.js'), content_bisheng, 'utf8');
    content_postReadMe && fsExtra.outputFileSync(path.resolve(initPath, 'posts/README.md'), content_postReadMe, 'utf8');
    isReactSPAProject && content_serverTpl && fsExtra.outputFileSync(path.resolve(initPath, 'server/index.js'), content_serverTpl, 'utf8');
    isReactSPAProject && content_webpackDev && fsExtra.outputFileSync(path.resolve(initPath, 'server/webpack.config.dev.js'), content_webpackDev, 'utf8');
    content_storybook_addons && fsExtra.outputFileSync(path.resolve(initPath, '.storybook/addons.js'), content_storybook_addons, 'utf8');
    content_storybook_config && fsExtra.outputFileSync(path.resolve(initPath, '.storybook/config.js'), content_storybook_config, 'utf8');
    content_storybook_mhead && fsExtra.outputFileSync(path.resolve(initPath, '.storybook/manager-head.html'), content_storybook_mhead, 'utf8');
    content_storybook_webpack && fsExtra.outputFileSync(path.resolve(initPath, '.storybook/webpack.config.js'), content_storybook_webpack, 'utf8');
    content_doczrc && fsExtra.outputFileSync(path.resolve(initPath, 'doczrc.js'), content_doczrc, 'utf8');

    // ReadMe
    fsExtra.outputFileSync(path.resolve(initPath, 'README.md'), content_readMe, 'utf8');
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
    const { defaultDep, buildDep, tsDep, testDep, eslintDep, commitlintDep, stylelintDep, devServerDep } = devDependencies({
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

    if (pkgtool === 'cnpm' && initPath !== process.cwd()) {
      // fix cnpm cannot set prefix bug
      // pkgtool = 'npm';
      installCliPrefix = `cd ${initPath} && ${installCliPrefix}`;
      installDevCliPrefix = `cd ${initPath} && ${installDevCliPrefix}`;
    }

    const installCli = `${installCliPrefix} ${dependencies({
      project_type,
      build,
      ts,
      eslint,
      commitlint,
      style,
      stylelint,
      testFrame,
      devServer
    }).join(' ')}`;
    const installDevCli = defaultDep.length > 0 ? `${installDevCliPrefix} ${defaultDep.join(' ')}` : '';
    const installBuildDevCli = buildDep.length > 0 ? `${installDevCliPrefix} ${buildDep.join(' ')}` : '';
    const installTsDevCli = tsDep.length > 0 ? `${installDevCliPrefix} ${tsDep.join(' ')}` : '';
    const installTestDevCli = testDep.length > 0 ? `${installDevCliPrefix} ${testDep.join(' ')}` : '';
    const installEslintDevCli = eslintDep.length > 0 ? `${installDevCliPrefix} ${eslintDep.join(' ')}` : '';
    const installCommitlintDevCli = commitlintDep.length > 0 ? `${installDevCliPrefix} ${commitlintDep.join(' ')}` : '';
    const installStylelintDevCli = stylelintDep.length > 0 ? `${installDevCliPrefix} ${stylelintDep.join(' ')}` : '';
    const installServerDevCli = devServerDep.length > 0 ? `${installDevCliPrefix} ${devServerDep.join(' ')}` : '';

    return {
      installCli,
      installDevCli,
      installBuildDevCli,
      installTsDevCli,
      installTestDevCli,
      installEslintDevCli,
      installCommitlintDevCli,
      installStylelintDevCli,
      installServerDevCli
    };
  }

  function generateFiglet (fn: (done: () => void) => any) {
    function done () {
      spinner.succeed(chalk.green('🐸  [OMNI-DOOR] ✅  : 初始化项目完成 (Initialize project success) \n'));
      process.exit(0);
    }

    return figlet('omni cli', function (err, data) {
      if (err) {
        logErr('figlet 出现了问题！(Some thing about figlet is wrong!)');
        spinner.fail(chalk.red(`🐸  [OMNI-DOOR] ❌  : ${JSON.stringify(err)} \n`));
      }
      console.info(chalk.yellow(data || 'OMNI-DOOR CLI'));
      fn(done);
    });
  }

  async function presetTpl (createDir: boolean) {
    // loading start display
    spinner.start();

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
    } else if (utils) {
      cli = installClis.cli_lib_utils;
      tpl = templates.tpl_lib_utils;
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
        installServerDevCli
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
        installServerDevCli
      ], done, err => spinner.warn(chalk.yellow(`🐸  [OMNI-DOOR] ❗️ : ${JSON.stringify(err)} \n`))));
    } catch (err) {
      logErr('安装依赖出错了！(The installation of dependencies occurred some accidents!)');
      spinner.fail(chalk.red(`🐸  [OMNI-DOOR] ❌  : ${JSON.stringify(err)} \n`));
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
          spinner.info(chalk.yellowBright(`🐸  [OMNI-DOOR] 🔰  : 缺少包管理工具 ${pkgtool}！(Missing package management tool ${pkgtool}!)`));
          inquirer.prompt([{
            name: 'install',
            type: 'confirm',
            message: `自动安装 ${pkgtool} 到全局环境? (Automatic install the ${pkgtool} in the global environment?)`,
            default: true
          }]).then(answers => {
            const { install } = answers;
            if (!install) {
              process.exit(0);
              return;
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

  if (simple || standard || entire || utils || components) {

    if (fs.existsSync(omniConfigPath)) {
      // double confirmation
      inquirer.prompt([{
        name: 'overwrite',
        type: 'confirm',
        message: '确定要覆盖已经存在的 [omni.config.js] 文件? (Are you sure to overwrite [omni.config.js]?)',
        default: false
      }]).then(answers => {
        const { overwrite } = answers;
        if (!overwrite) {
          process.exit(0);
          return;
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
        message: '确定要覆盖已经存在的 [omni.config.js] 文件? (Are you sure to overwrite [omni.config.js]?)',
        default: false
      },{
        name: 'name',
        type: 'input',
        message: '请输入项目名称 (please enter your project name)：',
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
        message: '请选择项目类型 (please choose the type of project)：'
      },{
        name: 'ts',
        type: 'confirm',
        message: '是否使用typescript? (whether or not apply typescript?)'
      },{
        name: 'eslint',
        type: 'confirm',
        message: '是否使用eslint? (whether or not apply eslint?)'
      },{
        name: 'commitlint',
        type: 'confirm',
        message: '是否使用commitlint? (whether or not apply commitlint?)'
      },{
        name: 'style',
        type: 'list',
        choices: [ 'less', 'scss', 'css', 'all', 'none' ],
        message: '应用哪种样式文件? (which the stylesheet type you like applying?)',
        default: 'less',
        when: function (answer: any) {
          if (answer.style === 'toolkit (工具库)') {
            return false;
          }
          return true;
        }
      },{
        name: 'stylelint',
        type: 'confirm',
        message: '是否使用stylelint? (whether or not apply stylelint?)',
        when: function (answer: any) {
          if (!answer.style || answer.style === 'none') {
            return false;
          }
          return true;
        }
      },{
        name: 'test',
        type: 'list',
        choices: [ 'mocha', 'jest', 'karma', 'none' ],
        message: '应用哪种单测框架? (which unit test frame would you like applying?)'
      },{
        name: 'build',
        type: 'list',
        choices: [ 'webpack', 'rollup', 'tsc', 'none' ],
        message: '应用哪种打包工具? (which build tool would you like applying?)'
      },{
        name: 'git',
        type: 'input',
        message: '请输入你的git仓库地址 (please enter your git repo address)：'
      },{
        name: 'npm',
        type: 'list',
        choices: [ 'none', 'npm', 'yarn', 'cnpm', 'taobao', 'set by yourself' ],
        message: '请选择npm仓库地址 (please chioce the npm depository address)：'
      },{
        name: 'npm_custom',
        type: 'input',
        message: '请输入npm仓库地址 (please input the npm depository address)：',
        when: function (answer: any) {
          if (answer.npm === 'set by yourself') {
            return true;
          }
          return false;
        },
        validate: function (input: any) {
          if (!input) {
            return 'Please input your npm depository address';
          }
  
          return true;
        }
      },{
        name: 'cdn',
        type: 'list',
        choices: [ 'none', 'set by yourself' ],
        message: '请选择cdn地址 (please chioce the cdn address)：'
      },{
        name: 'cdn_custom',
        type: 'input',
        message: '请输入cdn地址 (please input the cdn address)：',
        when: function (answer: any) {
          if (answer.cdn === 'set by yourself') {
            return true;
          }
          return false;
        },
        validate: function (input: any) {
          if (!input) {
            return 'Please input your cdn address';
          }
  
          return true;
        }
      },{
        name: 'dev_server',
        type: 'list',
        choices: [ 'basic', 'docz', 'storybook', 'bisheng', 'none' ],
        message: '请选择开发服务 (please chioce the development server)：',
        default: 'basic'
      },{
        name: 'pkgtool',
        type: 'list',
        choices: [ 'yarn', 'npm', 'cnpm' ],
        message: '请选择包安装工具，推荐使用yarn (please chioce the package install tool, recommended use yarn)：',
        default: 'yarn'
      }
    ];

    let createDir = false;
    try {
      // if the config file non-existence，cancel double confirmation
      if (!fs.existsSync(omniConfigPath)) {
        questions.shift();
        createDir = true;
      }
    } catch (err) {
      spinner.warn(chalk.yellow(`🐸  [OMNI-DOOR] ❗️ : ${JSON.stringify(err)} \n`));
    }

    inquirer.prompt(questions)
      .then(async (answers) => {
        const { name, project_type, ts, eslint, commitlint, style, stylelint, test, build, git, npm, npm_custom, cdn, cdn_custom, dev_server, pkgtool } = answers;

        const testFrame: TESTFRAME = test === 'none' ? '' : test;
        const stylesheet = style === 'none' ? '' : style;

        // loading start display
        spinner.start();

        generateTpls({
          createDir,
          project_type,
          name,
          build,
          ts,
          test: test === 'none' ? false : true,
          testFrame,
          eslint,
          commitlint,
          style: stylesheet,
          stylelint,
          git,
          npm: npm_custom || (npm === 'none' ? '' : npm),
          cdn: cdn_custom || (cdn === 'none' ? '' : cdn),
          devServer: dev_server === 'none' ? '' : dev_server
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
          installServerDevCli
        } = await generateInstallDenpendencies({
          project_type: ProjectType[project_type as keyof typeof ProjectType],
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

        // init git
        const gitCli = git ? `cd ${initPath} && git init && git remote add origin ${git}` : '';

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
          gitCli
        ], done, err => spinner.warn(chalk.yellow(`🐸  [OMNI-DOOR] ❗  : ${JSON.stringify(err)} \n`))));
      })
      .catch(err => {
        logErr('安装依赖出错了！(The installation of dependencies occurred some accidents!)');
        spinner.fail(chalk.red(`🐸  [OMNI-DOOR] ❌  : ${JSON.stringify(err)} \n`));
        process.exit(1);
      });
  }
}