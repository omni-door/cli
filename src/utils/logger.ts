import chalk from 'chalk';
import logo from './logo';

export function logErr (err: string) {
  console.error(chalk.red(logo, err, '  ❌  \n'));
}

export function logWarn (warn: string) {
  console.warn(chalk.yellow(logo, warn, '  ❗  \n'));
}

export function logInfo (info: string) {
  console.info(chalk.white(logo, info, '  🔊  \n'));
}

export function logDetail (info: string) {
  console.info(chalk.gray(logo, info));
}

export function logEmph (info: string) {
  console.info(chalk.cyan(logo, info, '  🚩  \n'));
}

export function logSuc (msg: string) {
  console.info(chalk.green(logo, msg, '  ✅  \n'));
}