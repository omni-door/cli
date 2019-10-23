import path from 'path';
import fs from 'fs';
import fsExtra from 'fs-extra';
import chalk from 'chalk';
import figlet from 'figlet';
import inquirer from 'inquirer';
import shelljs from 'shelljs';
import omniConfigJs from '../templates/omni.config';

export default function () {
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
      validate: function (input: any) {
        if (!input) {
          return 'Please input your project name';
        }

        return true;
      },
      when: function (answer: any) {
        if (!answer.confirm) {
          return process.exit(0);
        }
        return true;
      }
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
      name: 'git',
      type: 'input',
      message: '请输入你的git仓库地址 (please enter your git repo address)'
    },{
      name: 'npm',
      type: 'rawlist',
      choices: [ 'npm', 'hnpm', 'set by yourself' ],
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
      choices: [ 'w1', 'w4', 'w11', 'set by yourself' ],
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
      const { name, ts, eslint, commitlint, stylelint, test, git, npm, npm_custom, cdn, cdn_custom } = answers;

      const content = omniConfigJs({
        test: test === 'no thanks' ? false : true,
        eslint,
        commitlint,
        stylelint,
        git,
        npm: npm_custom || npm,
        cdn: cdn_custom || cdn
      });

      shelljs.echo('npm init');
      figlet('omni cli', function (err, data) {
        if (err) {
          console.error(chalk.red('Some thing about figlet is wrong!'));
        }
    
        console.info(chalk.yellow(data || 'OMNI CLI'));
        fsExtra.outputFileSync(targetFilePath, content, 'utf8');
        console.info(chalk.green('Initialize project success \n'));
        process.exit(0);
      });
    })
    .catch(err => {
      console.error(chalk.red(err));
    });
}