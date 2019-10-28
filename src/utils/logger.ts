import chalk from 'chalk';

export function logErr (err: string) {
  console.error(chalk.red('🐸  [OMNI-DOOR] ❌  ERROR:', err));
}

export function logWarn (warn: string) {
  console.warn(chalk.yellow('🐸  [OMNI-DOOR] ❗  WARN:', warn));
}

export function logInfo (info: string) {
  console.info(chalk.white('🐸  [OMNI-DOOR] 🌷  INFO:', info));
}

export function logEmph (info: string) {
  console.info(chalk.cyan('🐸  [OMNI-DOOR] 🔥  EMPH:', info));
}

export function logSuc (msg: string) {
  console.info(chalk.green('🐸  [OMNI-DOOR] ✅  :', msg));
}