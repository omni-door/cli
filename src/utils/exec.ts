import shelljs from 'shelljs';
import { logInfo, logErr } from './logger';

export async function execShell (clis: string[], done?: () => any, handleErr?: (err: any) => any) {
  for (let i = 0; i < clis.length; i++) {
    const cli = clis[i];
    if (!cli) continue;

    try {
      await new Promise((resolve, reject) => {
        shelljs.exec(cli, {
          async: true
        }, function (code, stdout, stderr) {
          resolve(stdout);
        });
      })
        .then(res => logInfo(`${i}-shelljs.exec.then ` +  res))
        .catch(err => logErr(`${i}-shelljs.exec.catch ` + err));
    } catch (err) {
      logErr(JSON.stringify(err));
      return handleErr && handleErr(err);
    }
    
  }
  return done && done();
}

export default execShell;