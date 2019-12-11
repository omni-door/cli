import chalk from 'chalk';

export function logErr (err: string) {
  console.error(chalk.red('🐸  [OMNI-DOOR]:', err, '  ❌  \n'));
}

export function logWarn (warn: string) {
  console.warn(chalk.yellow('🐸  [OMNI-DOOR]:', warn, '  ❗  \n'));
}

export function logInfo (info: string) {
  console.info(chalk.white('🐸  [OMNI-DOOR]:', info, '  📣  \n'));
}

export function logEmph (info: string) {
  console.info(chalk.cyan('🐸  [OMNI-DOOR]:', info, '  🚩  \n'));
}

export function logSuc (msg: string) {
  console.info(chalk.green('🐸  [OMNI-DOOR]:', msg, '  ✅  \n'));
}