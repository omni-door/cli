import fs from 'fs';
import path from 'path';
import { logErr, logInfo, logWarn, logSuc, logEmph } from '../../utils/logger';
import { execShell } from '../../utils/exec';
import { OmniConfig } from '../../index.d';

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

  const pkjPath = path.resolve(process.cwd(), 'package.json');
  let pkj = {
    name: 'OMNI-PROJECT',
    version: '0.0.1'
  };
  if (fs.existsSync(pkjPath)) {
    pkj = require(pkjPath);
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
      function () { process.exit(0); }
    );
    if (!~branchInfo.indexOf('current branch is')) {
      // branch check failed!
      return;
    }
  }

  const message = 'starting release process! 🕰';
  logInfo(message);

  function handleReleaseSuc (msg?: string) {
    msg = msg || 'release process completed!';

    return function () {
      logSuc(`${msg} 📣`);
    };
  }

  function handleReleaseErr (msg?: string) {
    msg = msg || 'release failed!';

    return function (err: any) {
      logErr(msg!);
      process.exit(0);
    };
  }

  try {
    if (test) {
      await execShell(['npm test'], () => logEmph('unit test passed! 🚩'), handleReleaseErr('unit test failed!'));
    }

    if (eslint) {
      await execShell(['npm run lint:es'], () => logEmph('eslint passed! 🚩'), handleReleaseErr('eslint checking failed!'));
    }

    if (stylelint) {
      await execShell(['npm run lint:style'], () => logEmph('stylelint passed! 🚩'), handleReleaseErr('stylelint checking failed!'));
    }

    const { ignore, manual } = iterTactic || {};
    const versionShellSuffix = ignore ? 'i' : manual ? manual : '';

    await execShell(
      [`${path.resolve(__dirname, 'version.sh')} ${versionShellSuffix}`],
      function () {},
      function () {}
    );

    if (git) {
      let gitUrl = '';
      await execShell([
        'git remote get-url origin'
      ], function (results) {
        gitUrl = results[0];
      });

      let setUrl = true;
      if (git !== gitUrl) {
        logInfo(`set git remote origin to: ${git}`);
        await execShell(
          [`git remote add origin ${git}`],
          () => logEmph(`git remote/origin is: ${git}!`),
          () => {
            logWarn('git set remote failed!');
            setUrl = false;
          }
        );
      }

      const commit = commitlint
        ? `git commit -m'[${pkj.name.toUpperCase()}]: ${pkj.version}'`
        : `git commit -m'[${pkj.name.toUpperCase()}]: ${pkj.version}' --no-verify`;

      const push = commitlint
        ? `git push origin ${branch || 'master'}`
        : `git push origin ${branch || 'master'} --no-verify`;

      setUrl && await execShell(
        [
          'git add -A',
          `${commit}`,
          `${push}`
        ],
        () => logEmph('git push success!'),
        () => logWarn('git push failed!')
      );
    }

    if (npm) {
      let npmUrl = '';
      await execShell(
        ['npm get registry'],
        function (results) {
          npmUrl = results[0];
        }
      );

      let setUrl = true;
      if (npm !== npmUrl) {
        logInfo(`set npm registry to: ${npm}`);
        await execShell(
          [`npm set registry ${npm}`],
          () => {
            execShell(['./branch.sh']);
            process.exit(0);
          },
          () => {
            logWarn('set npm registry failed!');
            setUrl = false;
          }
        );
      }

      setUrl && await execShell(
        ['npm publish'],
        () => logEmph('npm publish success!'),
        () => logWarn('npm publish failed!')
      );
    }

    handleReleaseSuc()();
  } catch (err) {
    logErr(`Oops! release process occured some accidents 👉  ${JSON.stringify(err)}`);
  }
}