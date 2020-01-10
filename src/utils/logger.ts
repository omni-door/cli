import chalk from 'chalk';
import getLogPrefix from './log_prefix';

export function logErr (err: string) {
  console.error(chalk.red(getLogPrefix(), err, '  ❌  \n'));
}

export function logWarn (warn: string) {
  console.warn(chalk.yellow(getLogPrefix(), warn, '  ❗  \n'));
}

export function logInfo (info: string) {
  console.info(chalk.white(getLogPrefix(), info, '  🔊  \n'));
}

export function logDetail (info: string) {
  console.info(chalk.gray(getLogPrefix(), info));
}

export function logEmph (info: string) {
  console.info(chalk.cyan(getLogPrefix(), info, '  🚩  \n'));
}

export function logSuc (msg: string) {
  console.info(chalk.green(getLogPrefix(), msg, '  ✅  \n'));
}