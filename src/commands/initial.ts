import path, { parse } from 'path';
import fs from 'fs';
import fsExtra from 'fs-extra';
import chalk from 'chalk';
import figlet from 'figlet';
import inquirer from 'inquirer';
import clui from 'clui';
import shelljs from 'shelljs';
import omniConfigJs from '../templates/omni';
import packageJson from '../templates/package';
import stylelintConfigJs from '../templates/stylelint';
import commitlintConfigJs from '../templates/commitlint';
import babelConfigJs from '../templates/babel';
import bishengConfigJs from '../templates/bisheng';
import tsConfigJson from '../templates/tsconfig';
import { dependencies, devDependencies } from './dependecies';
import { TESTFRAME } from '../index.d';

export default function () {
  const { name } = parse(process.cwd());
  const targetFilePath = path.resolve('omni.config.js');

  const question = [
    {
      name: 'confirm',
      type: 'confirm',
      message: '确定要覆盖已经存在的 [omni.config.js] 文件? (Are you sure to overwrite [omni.config.js]?)',
      default: false
    },{
      name: 'name',
      type: 'input',
      message: '请输入项目名称 (please enter your project name)',
      when: function (answer: any) {
        if (answer.confirm === false) {
          return process.exit(0);
        }
        return true;
      },
      default: name
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
      name: 'stylelint',
      type: 'confirm',
      message: '是否使用stylelint? (whether or not apply stylelint?)'
    },{
      name: 'test',
      type: 'rawlist',
      choices: [ 'mocha', 'jest', 'no thanks' ],
      message: '应用那种单测框架? (which unit test frame would you like apllying?)',
    },{
      name: 'build',
      type: 'rawlist',
      choices: [ 'webpack', 'rollup', 'tsc', 'no thanks' ],
      message: '应用那种打包工具? (which build tool would you like apllying?)',
    },{
      name: 'git',
      type: 'input',
      message: '请输入你的git仓库地址 (please enter your git repo address)'
    },{
      name: 'npm',
      type: 'rawlist',
      choices: [ 'npm', 'hnpm', 'set by yourself', 'no thanks' ],
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
      choices: [ 'w1', 'w4', 'w11', 'set by yourself', 'no thanks' ],
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
    !fs.existsSync(targetFilePath) && question.shift();
  } catch (err) {
    console.error(chalk.red(err));
  }

  inquirer.prompt(question)
    .then(answers => {
      const { name, ts, eslint, commitlint, stylelint, test, build, git, npm, npm_custom, cdn, cdn_custom, pkgtool } = answers;

      const testFrame: TESTFRAME = test === 'no thanks' ? '' : test;
      const installCliPrefix = pkgtool === 'yarn' ? `${pkgtool} add` : `${pkgtool} install --save`;
      const installCli = `${installCliPrefix} ${dependencies().join(' ')}`;
      const installCliDevPrefix = pkgtool === 'yarn' ? `${pkgtool} add -D` : `${pkgtool} install --save-dev`;
      const installCliDev = `${installCliDevPrefix} ${devDependencies({
        build,
        ts,
        eslint,
        commitlint,
        stylelint,
        testFrame
      }).join(' ')}`;

      const content_omni = omniConfigJs({
        ts,
        test: test === 'no thanks' ? false : true,
        testFrame,
        eslint,
        commitlint,
        stylelint,
        git,
        npm: npm_custom || npm === 'no thanks' ? '' : npm,
        cdn: cdn_custom || cdn === 'no thanks' ? '' : cdn
      });

      const content_pkg = packageJson({ name });
      const content_bisheng = bishengConfigJs();
      const content_stylelint = stylelint && stylelintConfigJs();
      const content_commitlint = commitlint && commitlintConfigJs({ name });
      const content_babel = build && build !== 'tsc' && babelConfigJs({ ts });
      const content_ts = ts && tsConfigJson();

      figlet('omni cli', function (err, data) {
        if (err) {
          console.error(chalk.red('Some thing about figlet is wrong!'));
        }
        console.info(chalk.yellow(data || 'OMNI CLI'));
        const progress = new clui.Progress(30);

        fsExtra.outputFileSync(targetFilePath, content_omni, 'utf8');
        progress.update(0.05);

        fsExtra.outputFileSync(path.resolve('package.json'), content_pkg, 'utf8');
        progress.update(0.15);

        fsExtra.outputFileSync(path.resolve('bisheng.config.js'), content_bisheng, 'utf8');
        progress.update(0.2);

        content_stylelint && fsExtra.outputFileSync(path.resolve('stylelint.config.js'), content_stylelint, 'utf8');
        progress.update(0.25);

        content_commitlint && fsExtra.outputFileSync(path.resolve('commitlint.config.js'), content_commitlint, 'utf8');
        progress.update(0.3);

        content_babel && fsExtra.outputFileSync(path.resolve('bable.config.js'), content_babel, 'utf8');
        progress.update(0.35);

        content_ts && fsExtra.outputFileSync(path.resolve('tsconfig.json'), content_ts, 'utf8');
        progress.update(0.4);

        shelljs.exec(installCli);
        progress.update(0.5);

        shelljs.exec(installCliDev);
        progress.update(0.8);

        /**
         * todo 1. eslint --init
         * todo 2. jest --init
         */
        progress.update(1);
        console.info(chalk.green('Initialize project success \n'));
        process.exit(0);
      });
    })
    .catch(err => {
      console.error(chalk.red(err));
    });
}