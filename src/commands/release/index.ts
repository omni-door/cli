import fs from 'fs';
import path from 'path';
import { logErr, logInfo, logWarn, logSuc, logEmph } from '../../utils/logger';
import { execShell } from '../../utils/exec';
import { OmniConfig } from '../../index.d';

const pkjPath = path.resolve(process.cwd(), 'package.json');
let pkj = {
  name: 'OMNI-PROJECT',
  version: '0.0.1'
};
if (fs.existsSync(pkjPath)) {
  pkj = require(pkjPath);
}

/**
 * todo 1. cdn release
 */
export default async function (config: OmniConfig | {}, iterTactic?: {
  ignore?: boolean;
  manual?: string;
}) {
  if (JSON.stringify(config) === '{}') {
    logWarn('Please Initialize project first');
    return;
  }

  const { release: {
    git,
    npm,
    cdn,
    test,
    eslint,
    stylelint,
    commitlint,
    branch
  } } = config as OmniConfig;

  if (branch) {
    // branch check
    let branchInfo = '';
    await execShell(
      [`${path.resolve(__dirname, 'branch.sh')} ${branch}`],
      function (results) { branchInfo = results[0]; },
      function () {},
      true
    );
    if (!~branchInfo.indexOf('current branch is')) {
      // branch check failed!
      return;
    }
  }

  const message = 'starting release process! 🕰';
  logInfo(message);

  try {
    if (test) {
      await execShell(['npm test'], () => logEmph('unit test passed! 🔈'), err => logWarn(`unit test failed! 👉  ${JSON.stringify(err)}`));
    }

    if (eslint) {
      await execShell(['npm run lint:es'], () => logEmph('eslint passed! 🔈'), err => logWarn(`eslint checking failed! 👉  ${JSON.stringify(err)}`));
    }

    if (stylelint) {
      await execShell(['npm run lint:style'], () => logEmph('stylelint passed! 🔈'), err => logWarn(`stylelint checking failed! 👉  ${JSON.stringify(err)}`));
    }

    const { ignore, manual } = iterTactic || {};
    const versionShellSuffix = ignore ? 'i' : manual;

    await execShell(
      [`${path.resolve(__dirname, 'version.sh')} ${versionShellSuffix}`],
      function () {},
      function () {},
      true
    );

    if (git) {
      let gitUrl = '';
      await execShell([
        'git remote get-url origin'
      ], function (results) {
        gitUrl = results[0];
      });

      if (git !== gitUrl) {
        await execShell(
          [
            `git remote add origin ${gitUrl}`
          ],
          () => logEmph(`git set remote to ${gitUrl}!`),
          err => logWarn(`git set remote failed! 👉  ${JSON.stringify(err)}`)
        );
      }

      const commit = commitlint
        ? `git commit -m'[${pkj.name.toUpperCase()}]: ${pkj.version}'`
        : `git commit -m'[${pkj.name.toUpperCase()}]: ${pkj.version}' --no-verify`;

      const push = commitlint
        ? 'git push origin master'
        : 'git push origin master --no-verify';

      await execShell(
        [
          'git add -A',
          `${commit}`,
          `${push}`
        ],
        () => logEmph('git push success!'),
        err => logWarn(`git push failed! 👉  ${JSON.stringify(err)}`)
      );
    }

    if (npm) {
      await execShell(
        [
          `npm set registry ${npm}`,
          'npm publish'
        ],
        (results) => {
          if (~results[1].indexOf('npm ERR!')) {
            logInfo(results[1]);
            logWarn('npm publish failed!');
          } else {
            logEmph('npm publish success!');
          }
        },
        err => logWarn(`npm publish failed! 👉  ${JSON.stringify(err)}`),
        true
      );
    }

    logSuc('release success! 📣');
  } catch (err) {
    logErr(`Oops! release process occured some accidents 👉  ${JSON.stringify(err)}`);
  }
}