import path from 'path';
import fs from 'fs';
import fsExtra from 'fs-extra';
import chalk from 'chalk';
import figlet from 'figlet';
import inquirer from 'inquirer';

const targetFilePath = path.resolve('omni.config.js');
function generateConfigFile () {
  figlet('meet cli', function (err, data) {
    if (err) {
      console.error(chalk.red('Some thing about figlet is wrong!'));
    }

    console.info(chalk.yellow(data || 'without data'));
    let templatePath = path.join(__dirname, '../templates/omni.config.ts');
    let contents = fs.readFileSync(templatePath, 'utf8');
    fs.writeFileSync(targetFilePath, contents, 'utf8');
    console.info(chalk.green('Initialize omni config success \n'));
    process.exit(0);
  });
}

export default function () {
  if (fs.existsSync(targetFilePath)) {
    inquirer.prompt([{
      name: 'init-overwrite-confirm',
      type: 'confirm',
      message: '[omni.config.js] is already existed, are you sure to overwrite it?',
      validate: function (input) {
        if (input.lowerCase !== 'y' && input.lowerCase !== 'n') {
          return 'Please input y/n !';
        }
        else {
          return true;
        }
      }
    }])
      .then(answers => {
        if (answers['init-overwrite-confirm']) {
          generateConfigFile();
        } else {
          process.exit(0);
        }
      })
      .catch(err => {
        console.error(chalk.red(err));
      });
  }
}