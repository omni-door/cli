import inquirer from 'inquirer';
import { logErr } from '../../utils/logger';
import { getLogo } from '../../utils/log_prefix';
import server, { ServerOptions } from './server';

export default async function ({
  p,
  ...rest
}: ServerOptions): Promise<void> {
  try {
    const detectPort = require('detect-port');

    const _p = await detectPort(p).catch((err: any) => {
      logErr(err);
      return process.exit(1);
    });

    if (p !== _p) {
      inquirer.prompt([
        {
          name: 'changePort',
          type: 'confirm',
          message: `${getLogo()} ${p} 端口被占用了，切换到 ${_p}? (Port ${p} is not available, Would you like to run on ${_p}?)`,
          default: true
        }
      ]).then(answer => {
        if (answer.changePort) {
          server(Object.assign(rest, { p: _p }));
        } else {
          process.exit(0);
        }
      });
    } else {
      server(Object.assign(rest, { p }));
    }
  } catch (err) {
    logErr(err);
  }
}