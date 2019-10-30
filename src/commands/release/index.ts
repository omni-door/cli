import path from 'path';
import fsExtra from 'fs-extra';
import { logErr, logInfo, logWarn, logSuc, logEmph } from '../../utils/logger';
import { execShell } from '../../utils/exec';
import { OmniConfig } from '../../index.d';

export default async function (config: OmniConfig | {}, iterTactic?: {
  ignore?: boolean;
  manual?: boolean;
}) {
  if (JSON.stringify(config) === '{}') {
    logWarn('Please Initialize project first');
    return;
  }

  const message = '🕰  starting release process!';
  logInfo(message);

  const { release: {
    git,
    npm,
    cdn,
    commitlint
  } } = config as OmniConfig;

  function releaseSuc () {
    logSuc('📣  release success!');
  }

  function releaseErr (err: any) {
    logErr(`release failed! 👉  ${JSON.stringify(err)}`);
  }

  try {
    if (git) {
      await execShell([
        'git remote get-url origin'
      ]).then(gitUrl => {
        // console.log('gitUrl', gitUrl);
      });
    }


  } catch (err) {
    logErr(`Oops! release process occured some accidents 👉  ${JSON.stringify(err)}`);
  }
}