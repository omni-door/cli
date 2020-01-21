import shelljs from 'shelljs';
import { logErr } from './logger';

export async function execShell (clis: string[], done?: (results: any[]) => any, handleErr?: (err: any) => any, silent?: boolean) {
  const results = [];
  for (let i = 0; i < clis.length; i++) {
    const cli = clis[i];
    if (!cli) continue;

    try {
      const result = await new Promise((resolve, reject) => {
        shelljs.exec(cli, {
          async: true,
          silent: !!silent
        }, function (code, stdout, stderr) {
          if (code !== 0) {
            reject(stderr || stdout);
          } else {
            resolve(stdout || stderr);
          }
        });
      }).catch(err => {
        !silent && logErr(`${i}_[${cli}]:\n` + err);
        throw err;
      });

      results.push(result);
    } catch (err) {
      return handleErr && await handleErr(err);
    }
  }
  return done && await done(results);
}

export default execShell;