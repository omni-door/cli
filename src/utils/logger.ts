import chalk from 'chalk';
import brand from './brand';

export function logErr (err: string) {
  console.error(chalk.red(brand, err, '  ❌  \n'));
}

export function logWarn (warn: string) {
  console.warn(chalk.yellow(brand, warn, '  ❗  \n'));
}

export function logInfo (info: string) {
  console.info(chalk.white(brand, info, '  🔊  \n'));
}

export function logDetail (info: string) {
  console.info(chalk.gray(brand, info));
}

export function logEmph (info: string) {
  console.info(chalk.cyan(brand, info, '  🚩  \n'));
}

export function logSuc (msg: string) {
  console.info(chalk.green(brand, msg, '  ✅  \n'));
}