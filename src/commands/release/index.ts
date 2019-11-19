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
    logWarn('请先初始化项目！(Please Initialize project first!)');
    return;
  }

  const { release: {
    git,
    npm,
    cdn,
    test = false,
    eslint = false,
    stylelint = false,
    commitlint = false,
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

  const message = '开始发布！(starting release process!) 🕰';
  logInfo(message);

  function handleReleaseSuc (msg?: string) {
    msg = msg || '恭喜！发布完成！(release process completed!)';

    return function () {
      logSuc(`${msg} 📣`);
    };
  }

  function handleReleaseErr (msg?: string) {
    msg = msg || '发布失败！(release failed!)';

    return function (err: any) {
      logErr(msg!);
      process.exit(0);
    };
  }

  try {
    if (test) {
      await execShell(['npm test'], () => logEmph('单元测试通过！(unit test passed!) 🚩'), handleReleaseErr('单元测试失败！(unit test failed!)'));
    }

    if (eslint) {
      await execShell(['npm run lint:es'], () => logEmph('eslint校验通过！(eslint passed!) 🚩'), handleReleaseErr('eslint校验失败！(eslint checking failed!)'));
    }

    if (stylelint) {
      await execShell(['npm run lint:style'], () => logEmph('stylelint校验通过！(stylelint passed!) 🚩'), handleReleaseErr('stylelint校验失败！(stylelint checking failed!)'));
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
        gitUrl = results[0] && results[0].trim();
      });

      let canPush = true;
      if (git.trim() !== gitUrl) {
        logInfo(`自动设置git remote 的 origin_omni_release 为 ${git} (auto set git remote origin_omni_release to: ${git})`);
        await execShell(
          [`git remote add origin_omni_release ${git}`],
          () => logEmph(`git remote origin_omni_release 为 ${git} (git remote origin_omni_release is: ${git})`),
          () => {
            logWarn('git remote 设置失败！(setting git remote failed!)');
            canPush = false;
          }
        );
      }

      const pkjPath = path.resolve(process.cwd(), 'package.json');
      let pkj = {
        name: 'OMNI-PROJECT',
        version: '0.0.1'
      };
      if (fs.existsSync(pkjPath)) {
        pkj = require(pkjPath);
      }

      const commit = commitlint
        ? `git commit -m'[${pkj.name.toUpperCase()}]: ${pkj.version}'`
        : `git commit -m'[${pkj.name.toUpperCase()}]: ${pkj.version}' --no-verify`;

      const push = commitlint
        ? `git push origin_omni_release ${branch || 'master'}`
        : `git push origin_omni_release ${branch || 'master'} --no-verify`;

      canPush && await execShell(
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
          npmUrl = results[0] && results[0].trim();
        }
      );

      if (npm.trim() !== npmUrl && npm.trim() + '/' !== npmUrl) {
        logInfo(`自动设置 npm registry 地址为 ${npm} (auto set npm registry to: ${npm})`);
        await execShell(
          [`npm set registry ${npm}`],
          () => logEmph('npm registry 设置成功，请执行 $npm publish 进行发布！(npm set registry success, please run $npm publish by yourself!)'),
          () => logWarn('npm registry 设置失败！(set npm registry failed!)')
        );
      } else {
        await execShell(
          ['npm publish'],
          () => logEmph('npm publish success!'),
          () => logWarn('npm publish failed!')
        );
      }
    }

    handleReleaseSuc()();
  } catch (err) {
    logErr(`糟糕！发布遇到了一点意外 (Oops! release process occured some accidents) 👉  ${JSON.stringify(err)}`);
  }
}