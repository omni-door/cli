import path, { parse } from 'path';
import fs from 'fs';
import fsExtra from 'fs-extra';
import chalk from 'chalk';
import figlet from 'figlet';
import inquirer from 'inquirer';
import shelljs from 'shelljs';
import ora from 'ora';
import omniConfigJs from '../templates/omni';
import packageJson from '../templates/package';
import stylelintConfigJs from '../templates/stylelint';
import commitlintConfigJs from '../templates/commitlint';
import babelConfigJs from '../templates/babel';
import bishengConfigJs from '../templates/bisheng';
import mochaOpts from '../templates/mocha';
import karmaConfigJs from '../templates/karma';
import jestConfigJs from '../templates/jest';
import tsConfigJson from '../templates/tsconfig';
import eslintrcJS from '../templates/eslint';
import eslintignore from '../templates/eslintignore';
import gitignore from '../templates/gitignore';
import npmignore from '../templates/npmignore';
import webpackConfigJs from '../templates/build/webpack';
import serverTpl from '../templates/server';
import webpackDevConfigJs from '../templates/server/webpack_dev';
import indexTpl from '../templates/src/index';
import indexHtml from '../templates/src/html';
import postReadMe from '../templates/posts/readme';
import rollupConfigJs from '../templates/build/rollup';
import { dependencies, devDependencies } from '../configs/dependecies';
import templates from '../configs/initial_tpls';
import installClis from '../configs/initial_clis';
import { BUILD, NPM, CDN, TESTFRAME, PKJTOOL, STYLE, DevServer } from '../index.d';
import { logErr, logInfo } from '../utils/logger';

export type GTpls = {
  name: string;
  build: BUILD;
  ts: boolean;
  test: boolean;
  testFrame: TESTFRAME | '';
  eslint: boolean;
  commitlint: boolean;
  style: STYLE;
  stylelint: boolean;
  git: string;
  npm: NPM | '';
  cdn: CDN | '';
  devServer: DevServer;
};

export type GInstallCli = {
  pkgtool: PKJTOOL;
  build: BUILD;
  ts: boolean;
  testFrame: TESTFRAME | '';
  eslint: boolean;
  commitlint: boolean;
  style: STYLE;
  stylelint: boolean;
  devServer: DevServer;
};

const spinner = ora('🐸  [OMNI-DOOR]: Initialize in processing, please wait patiently  💤  \n');

/**
 * todo 1. gulp config
 * todo 2. rollup config stylesheet
 */
export default function ({
  simple,
  standard,
  entire,
  utils,
  components
}: {
  simple?: boolean;
  standard?: boolean;
  entire?: boolean;
  utils?: boolean;
  components?: boolean;
}) {
  const { name: defaultName } = parse(process.cwd());
  const omniConfigPath = path.resolve('omni.config.js');

  function generateTpls ({
    name,
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
    devServer
  }: GTpls) {
    // default files
    const content_omni = omniConfigJs({
      ts,
      test,
      testFrame,
      eslint,
      commitlint,
      style,
      stylelint,
      git,
      npm,
      cdn
    });
    const content_pkg = packageJson({ name, devServer });
    const content_gitignore = gitignore();
    const content_npmignore = npmignore();
    const content_indexTpl = indexTpl();
    const content_indexHtml = indexHtml({ name });

    // tsconfig
    const content_ts = ts && tsConfigJson();

    // test files
    const content_mocha = testFrame === 'mocha' && mochaOpts({ ts });
    const content_karma = testFrame === 'karma' && karmaConfigJs({ ts });
    const content_jest = testFrame === 'jest' && jestConfigJs({ ts });

    // lint files
    const content_eslintrc = eslint && eslintrcJS({ ts });
    const content_eslintignore = eslint && eslintignore();
    const content_stylelint = stylelint && stylelintConfigJs();
    const content_commitlint = commitlint && commitlintConfigJs({ name });

    // build files
    const content_babel = build && build !== 'tsc' && babelConfigJs({ ts });
    const content_webpack = build && build === 'webpack' && webpackConfigJs({ ts, style });
    const content_rollup = build && build === 'rollup' && rollupConfigJs({ ts });

    // server files
    const content_bisheng = devServer === 'bisheng' && bishengConfigJs({ name, git });
    const content_postReadMe = devServer === 'bisheng' && postReadMe();
    const content_serverTpl = devServer === 'express' && serverTpl();
    const content_webpackDev = devServer === 'express' && webpackDevConfigJs({ name, ts, style });

    /**
     * create files
     */

    // default files
    fsExtra.outputFileSync(omniConfigPath, content_omni, 'utf8');
    fsExtra.outputFileSync(path.resolve('package.json'), content_pkg, 'utf8');
    fsExtra.outputFileSync(path.resolve('.gitignore'), content_gitignore, 'utf8');
    fsExtra.outputFileSync(path.resolve('.npmignore'), content_npmignore, 'utf8');
    fsExtra.outputFileSync(path.resolve(`src/index.${ts ? 'tsx' : 'jsx'}`), content_indexTpl, 'utf8');
    fsExtra.outputFileSync(path.resolve('src/index.html'), content_indexHtml, 'utf8');

    // tsconfig
    content_ts && fsExtra.outputFileSync(path.resolve('tsconfig.json'), content_ts, 'utf8');

    // test files
    content_mocha && fsExtra.outputFileSync(path.resolve('mocha.opts'), content_mocha, 'utf8');
    content_karma && fsExtra.outputFileSync(path.resolve('karma.conf.js'), content_karma, 'utf8');
    content_jest && fsExtra.outputFileSync(path.resolve('jest.conf.js'), content_jest, 'utf8');

    // lint files
    content_eslintrc && fsExtra.outputFileSync(path.resolve('.eslintrc.js'), content_eslintrc, 'utf8');
    content_eslintignore && fsExtra.outputFileSync(path.resolve('.eslintignore'), content_eslintignore, 'utf8');
    content_stylelint && fsExtra.outputFileSync(path.resolve('stylelint.config.js'), content_stylelint, 'utf8');
    content_commitlint && fsExtra.outputFileSync(path.resolve('commitlint.config.js'), content_commitlint, 'utf8');

    // build files
    content_babel && fsExtra.outputFileSync(path.resolve('bable.config.js'), content_babel, 'utf8');
    content_webpack && fsExtra.outputFileSync(path.resolve('build/webpack.config.js'), content_webpack, 'utf8');
    content_rollup && fsExtra.outputFileSync(path.resolve('build/rollup.config.js'), content_rollup, 'utf8');

    // server files
    content_bisheng && fsExtra.outputFileSync(path.resolve('bisheng.config.js'), content_bisheng, 'utf8');
    content_postReadMe && fsExtra.outputFileSync(path.resolve('posts/ReadMe.md'), content_postReadMe, 'utf8');
    content_serverTpl && fsExtra.outputFileSync(path.resolve('server/index.js'), content_serverTpl, 'utf8');
    content_webpackDev && fsExtra.outputFileSync(path.resolve('server/webpack.config.dev.js'), content_webpackDev, 'utf8');
  }

  function generateInstallDenpendencies ({
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
    const installCliPrefix = pkgtool === 'yarn' ? `${pkgtool} add` : `${pkgtool} install --save`;
    const installCli = `${installCliPrefix} ${dependencies().join(' ')}`;
    const installDevCliPrefix = pkgtool === 'yarn' ? `${pkgtool} add -D` : `${pkgtool} install --save-dev`;
    const { defaultDep, buildDep, tsDep, testDep, eslintDep, commitlintDep, stylelintDep, devServerDep } = devDependencies({
      build,
      ts,
      eslint,
      commitlint,
      style,
      stylelint,
      testFrame,
      devServer
    });
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
      spinner.succeed(chalk.green('🐸  [OMNI-DOOR]: ✅  Initialize project success \n'));
      process.exit(0);
    }

    return figlet('omni cli', function (err, data) {
      if (err) {
        spinner.fail();
        logErr('Some thing about figlet is wrong!');
      }
      console.info(chalk.yellow(data || 'OMNI CLI'));
      fn(done);
    });
  }

  async function execShell (clis: string[], done?: () => void) {
    for (let i = 0; i < clis.length; i++) {
      const cli = clis[i];
      if (!cli) continue;

      try {
        await new Promise((resolve, reject) => {
          shelljs.exec(cli, {
            async: true
          }, function (code, stdout, stderr) {
            resolve(stdout);
          });
        })
          .then(res => logInfo(`${i}-shelljs.exec.then ` +  res))
          .catch(err => logErr(`${i}-shelljs.exec.catch ` + err));
      } catch (err) {
        spinner.warn();
        logErr(JSON.stringify(err));
      }
      
    }
    done && done();
  }

  if (simple || standard || entire || utils || components) {
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
      generateTpls(Object.assign(tpl, { name: defaultName }));

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
      } = generateInstallDenpendencies(cli as GInstallCli);
    
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
      ], done));
    } catch (err) {
      spinner.fail();
      logErr(JSON.stringify(err));
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
        message: '请输入项目名称 (please enter your project name)',
        when: function (answer: any) {
          if (answer.overwrite === false) {
            return process.exit(0);
          }
          return true;
        },
        default: defaultName
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
        type: 'rawlist',
        choices: [ 'less', 'scss', 'css', 'none' ],
        message: '应用那种样式文件? (which the stylesheet type you like apllying?)',
        default: 'less'
      },{
        name: 'stylelint',
        type: 'confirm',
        message: '是否使用stylelint? (whether or not apply stylelint?)',
        when: function (answer: any) {
          if (answer.style === 'none') {
            return false;
          }
          return true;
        }
      },{
        name: 'test',
        type: 'rawlist',
        choices: [ 'mocha', 'jest', 'karma', 'none' ],
        message: '应用那种单测框架? (which unit test frame would you like apllying?)',
      },{
        name: 'build',
        type: 'rawlist',
        choices: [ 'webpack', 'rollup', 'tsc', 'none' ],
        message: '应用那种打包工具? (which build tool would you like apllying?)',
      },{
        name: 'git',
        type: 'input',
        message: '请输入你的git仓库地址 (please enter your git repo address)'
      },{
        name: 'npm',
        type: 'rawlist',
        choices: [ 'npm', 'hnpm', 'set by yourself', 'none' ],
        message: '请选择npm仓库地址 (please chioce the npm depository address)'
      },{
        name: 'npm_custom',
        type: 'input',
        message: '请输入npm仓库地址 (please input the npm depository address)',
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
        type: 'rawlist',
        choices: [ 'w1', 'w4', 'w11', 'set by yourself', 'none' ],
        message: '请选择cdn地址 (please chioce the cdn address)'
      },{
        name: 'cdn_custom',
        type: 'input',
        message: '请输入cdn地址 (please input the cdn address)',
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
        type: 'rawlist',
        choices: [ 'express', 'bisheng', 'none' ],
        message: '请选择开发服务 (please chioce the development server)',
        default: 'express'
      },{
        name: 'pkgtool',
        type: 'rawlist',
        choices: [ 'npm', 'yarn', 'cnpm' ],
        message: '请选择包安装工具 (please chioce the package install tool)',
        default: 'yarn'
      }
    ];

    // 如果不存在config文件，取消二次确认的选项
    try {
      !fs.existsSync(omniConfigPath) && questions.shift();
    } catch (err) {
      spinner.warn();
      logErr(JSON.stringify(err));
    }

    inquirer.prompt(questions)
      .then(answers => {
        const { name, ts, eslint, commitlint, style, stylelint, test, build, git, npm, npm_custom, cdn, cdn_custom, dev_server, pkgtool } = answers;

        const testFrame: TESTFRAME = test === 'none' ? '' : test;
        const stylesheet = style === 'none' ? '' : style;

        // loading start display
        spinner.start();

        generateTpls({
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
          npm: npm_custom || npm === 'none' ? '' : npm,
          cdn: cdn_custom || cdn === 'none' ? '' : cdn,
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
        } = generateInstallDenpendencies({
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
        const gitCli = git ? `git init && git git remote add origin ${git}` : '';

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
        ], done));
      })
      .catch(err => {
        spinner.fail();
        logErr(JSON.stringify(err));
        process.exit(1);
      });
  }
}