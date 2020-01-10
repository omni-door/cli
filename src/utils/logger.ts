import chalk from 'chalk';
import getBrand from './brand';

export function logErr (err: string) {
  console.error(chalk.red(getBrand(), err, '  ❌  \n'));
}

export function logWarn (warn: string) {
  console.warn(chalk.yellow(getBrand(), warn, '  ❗  \n'));
}

export function logInfo (info: string) {
  console.info(chalk.white(getBrand(), info, '  🔊  \n'));
}

export function logDetail (info: string) {
  console.info(chalk.gray(getBrand(), info));
}

export function logEmph (info: string) {
  console.info(chalk.cyan(getBrand(), info, '  🚩  \n'));
}

export function logSuc (msg: string) {
  console.info(chalk.green(getBrand(), msg, '  ✅  \n'));
}