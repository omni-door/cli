import shelljs from 'shelljs';
import { logInfo, logErr } from './logger';

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
          if (code === 1) {
            reject(stderr);
          } else {
            resolve(stdout);
          }
        });
      })
        .then(res => {
          !silent && logInfo(`${i}-shelljs.exec.then.result~~~ ` +  res);
          return res;
        })
        .catch(err => {
          !silent && logErr(`${i}-shelljs.exec.catch.error~~~ ` + err);
          return err;
        });
      
      results.push(result);
    } catch (err) {
      logErr(JSON.stringify(err));
      return handleErr && handleErr(err);
    }
  }
  return done && done(results);
}

export default execShell;