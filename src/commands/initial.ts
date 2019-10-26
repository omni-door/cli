import path, { parse } from 'path';
import fs from 'fs';
import fsExtra from 'fs-extra';
import chalk from 'chalk';
import figlet from 'figlet';
import inquirer from 'inquirer';
import shelljs from 'shelljs';
import omniConfigJs from '../templates/omni';
import packageJson from '../templates/package';
import stylelintConfigJs from '../templates/stylelint';
import commitlintConfigJs from '../templates/commitlint';
import babelConfigJs from '../templates/babel';
import bishengConfigJs from '../templates/bisheng';
import tsConfigJson from '../templates/tsconfig';
import eslintignore from '../templates/eslintignore';
import gitignore from '../templates/gitignore';
import npmignore from '../templates/npmignore';
import webpackConfigJs from '../templates/build/webpack';
import rollupConfigJs from '../templates/build/rollup';
import { dependencies, devDependencies } from '../configs/dependecies';
import templates from '../configs/initial_tpls';
import installClis from '../configs/initial_clis';
import { BUILD, NPM, CDN, TESTFRAME, PKJTOOL, STYLE } from '../index.d';

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
};

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
    cdn
  }: GTpls) {
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
    const content_pkg = packageJson({ name });
    const content_bisheng = bishengConfigJs();
    const content_stylelint = stylelint && stylelintConfigJs();
    const content_commitlint = commitlint && commitlintConfigJs({ name });
    const content_babel = build && build !== 'tsc' && babelConfigJs({ ts });
    const content_ts = ts && tsConfigJson();
    const content_eslint = eslint && eslintignore();
    const content_gitignore = gitignore();
    const content_npmignore = npmignore();
    const content_webpack = build && build === 'webpack' && webpackConfigJs({ ts, style });
    const content_rollup = build && build === 'rollup' && rollupConfigJs({ ts });

    fsExtra.outputFileSync(omniConfigPath, content_omni, 'utf8');

    fsExtra.outputFileSync(path.resolve('package.json'), content_pkg, 'utf8');

    fsExtra.outputFileSync(path.resolve('bisheng.config.js'), content_bisheng, 'utf8');

    content_stylelint && fsExtra.outputFileSync(path.resolve('stylelint.config.js'), content_stylelint, 'utf8');

    content_commitlint && fsExtra.outputFileSync(path.resolve('commitlint.config.js'), content_commitlint, 'utf8');

    content_babel && fsExtra.outputFileSync(path.resolve('bable.config.js'), content_babel, 'utf8');

    content_ts && fsExtra.outputFileSync(path.resolve('tsconfig.json'), content_ts, 'utf8');

    content_eslint && fsExtra.outputFileSync(path.resolve('.eslintignore'), content_eslint, 'utf8');

    fsExtra.outputFileSync(path.resolve('.gitignore'), content_gitignore, 'utf8');

    fsExtra.outputFileSync(path.resolve('.npmignore'), content_npmignore, 'utf8');

    content_webpack && fsExtra.outputFileSync(path.resolve('build/webpack.config.js'), content_webpack, 'utf8');

    content_rollup && fsExtra.outputFileSync(path.resolve('build/rollup.config.js'), content_rollup, 'utf8');
  }

  function generateInstallDenpendencies ({
    pkgtool,
    build,
    ts,
    eslint,
    commitlint,
    style,
    stylelint,
    testFrame
  }: GInstallCli) {
    const installCliPrefix = pkgtool === 'yarn' ? `${pkgtool} add` : `${pkgtool} install --save`;
    const installCli = `${installCliPrefix} ${dependencies().join(' ')}`;
    const installDevCliPrefix = pkgtool === 'yarn' ? `${pkgtool} add -D` : `${pkgtool} install --save-dev`;
    const installDevCli = `${installDevCliPrefix} ${devDependencies({
      build,
      ts,
      eslint,
      commitlint,
      style,
      stylelint,
      testFrame
    }).join(' ')}`;

    return {
      installCli,
      installDevCli
    };
  }
  /**
   * todo 1. eslint --init
   * todo 2. jest --init
   * todo 3. gulp config
   * todo 4. rollup config stylesheet
   * todo 5. karma config
   */
  function generateFiglet (fn: (done: () => void) => any) {
    function done () {
      console.info(chalk.green('[omni-door]: Initialize project success \n'));
      process.exit(0);
    }

    return figlet('omni cli', function (err, data) {
      if (err) {
        console.error(chalk.red('Some thing about figlet is wrong!'));
      }
      console.info(chalk.yellow(data || 'OMNI CLI'));
      fn(done);
    });
  }

  async function execShell (clis: string[], done?: () => void) {
    for (let i = 0; i < clis.length; i++) {
      const cli = clis[i];
      await new Promise((resolve, reject) => {
        shelljs.exec(cli, {
          async: true
        }, function (code, stdout, stderr) {
          console.info(chalk.white('[omni-door] Exit code:', '' + code));
          console.info(chalk.yellow('[omni-door] output:', stdout));
          console.info(chalk.red('[omni-door] stderr:', stderr));
          resolve();
        });
      });
    }
    done && done();
  }

  let cli, tpl;

  if (simple || standard || entire || utils || components) {
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
      console.error(chalk.red(err));
    }

    inquirer.prompt(questions)
      .then(answers => {
        const { name, ts, eslint, commitlint, style, stylelint, test, build, git, npm, npm_custom, cdn, cdn_custom, pkgtool } = answers;

        const testFrame: TESTFRAME = test === 'none' ? '' : test;
        const stylesheet = style === 'none' ? '' : style;

        cli = {
          pkgtool,
          build,
          ts,
          eslint,
          commitlint,
          style: stylesheet,
          stylelint,
          testFrame
        };

        tpl = {
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
          cdn: cdn_custom || cdn === 'none' ? '' : cdn
        };
      })
      .catch(err => {
        console.error(chalk.red(`[omni-door]: ${JSON.stringify(err)}`));
        process.exit(1);
      });
  }

  generateTpls({...{ name: defaultName }, ...tpl} as GTpls);

  const { installCli, installDevCli } = generateInstallDenpendencies(cli as GInstallCli);

  generateFiglet((done) => execShell([installCli, installDevCli], done));
}