import shelljs from 'shelljs';
import { logWarn } from './logger';

async function node_version (v: string) {
  if (!v) return Promise.resolve(false);

  return new Promise((resolve, reject) => {
    shelljs.exec('node -v', {
      async: true,
      silent: true
    }, function (code, stdout, stderr) {
      if (code !== 0) {
        logWarn(stderr || stdout);
        return resolve(false);
      } else {
        let isValid = false;
        const regs = [reg_version(0), reg_version(1), reg_version(2)];
        for (const reg of regs) {
          if (reg.test(v)) {
            isValid = true;
            break;
          }
        }

        if (isValid) {
          const currentV = stdout.substr(1);
          const c_v_arr = currentV.split('.');
          const v_arr = v.split('.');
          for (var i = 0; i < v_arr.length; i++) {
            if (+v_arr[i] > +c_v_arr[i]) {
              break;
            }
          }
          return resolve(i === v_arr.length);
        }

        resolve(false);
      }
    });
  }).catch(err => logWarn(err));
}

function reg_version (vlevel: 0 | 1 | 2) {
  const regs = [
    new RegExp(/^(\d+).(\d+).(\d+)$/),
    new RegExp(/^(\d+).(\d+)$/),
    new RegExp(/^(\d+)$/)
  ];

  return regs[vlevel];
}

async function version_check (v: string) {
  const res = await node_version(v);
  if (!res) {
    logWarn(`请将 node 版本升级至 ${v} 以上 (Please upgrade the node version to ${v} or above)`);
    return process.exit(0);
  }

  return true;
}

export default version_check;