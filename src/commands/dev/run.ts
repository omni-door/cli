import inquirer from 'inquirer';
import { logErr, requireCwd } from '@omni-door/utils';
import server from './server';
import { logo } from '../../utils';
/* import types */
import type { ServerOptions } from './server';

export default async function ({
  p,
  ...rest
}: ServerOptions): Promise<void> {
  try {
    const detectPort = requireCwd('detect-port');

    const _p = await detectPort(p).catch((err: any) => {
      logErr(err);
      return process.exit(1);
    });

    if (p !== _p) {
      inquirer.prompt([
        {
          name: 'changePort',
          type: 'confirm',
          message: `The port ${p} is not available, would you like to run on ${_p}(${logo()} ${p} 端口被占用了，切换到 ${_p})?`,
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
    logErr(err as string);
    process.exit(1);
  }
}