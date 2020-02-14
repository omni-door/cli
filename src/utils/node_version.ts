import shelljs from 'shelljs';
import { logWarn } from './logger';

const VERSION_MATCH_DICT = [
  // specified-node-version compare to current-node-version
  {
    // first layer
    big: false,
    equal: void 0, // undefined means unknown true or false
    small: true
  },
  {
    // second layer
    big: false,
    equal: void 0,
    small: true
  },
  {
    // third layer
    big: false,
    equal: true,
    small: true
  }
];

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
          const currentV = stdout.substr(1).trim();
          const c_v_arr = currentV.split('.');
          const v_arr = v.split('.');
          let isMatch = true;
          for (let i = 0; i < v_arr.length; i++) {
            const state = +v_arr[i] > +c_v_arr[i] 
              ? 'big'
              : +v_arr[i] === +c_v_arr[i]
                ? 'equal'
                : 'small';
            const layer = VERSION_MATCH_DICT[i];
            if (layer[state] !== void 0) {
              // the state was determination
              !layer[state] && (isMatch = false);
              break;
            }
          }
          return resolve(isMatch);
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