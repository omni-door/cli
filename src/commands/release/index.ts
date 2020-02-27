import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import {
  exec, 
  logErr,
  logInfo,
  logWarn,
  logSuc,
  logEmph,
  logTime,
  italic,
  underline,
  node_version
} from '@omni-door/tpl-utils';
import { OmniConfig } from '../../index.d';
import { getHandlers } from '../../utils/tackle_plugins';

export default async function (config: OmniConfig | {}, iterTactic?: {
  ignore?: boolean;
  manual?: string;
  verify?: boolean;
}) {
  try {
    // node version pre-check
    await node_version('8');
  } catch (err) {
    logWarn(err);
  }

  if (JSON.stringify(config) === '{}') {
    logWarn('请先初始化项目！(Please initialize project first!)');
    return;
  }

  logTime('项目发布');
  const { release: {
    git,
    npm,
    preflight
  }, plugins } = config as OmniConfig;

  const {
    test = false,
    eslint = false,
    stylelint = false,
    commitlint = false,
    branch
  } = preflight || {};

  if (branch) {
    // branch check
    let branchInfo = '';
    await exec(
      [`${path.resolve(__dirname, 'branch.sh')} ${branch}`],
      function (results) { branchInfo = results[0]; },
      function () { process.exit(1); }
    );
    if (!~branchInfo.indexOf('current branch is')) {
      // branch check failed!
      return;
    }
  }

  const message = '开始发布！(starting release process!)';
  logInfo(message);

  function handleReleaseSuc (msg?: string) {
    msg = msg || '恭喜！发布完成！(release process completed!)';

    return function () {
      logSuc(msg!);
    };
  }

  function handleReleaseErr (msg?: string) {
    msg = msg || '发布失败！(release failed!)';

    return function (err: any) {
      err && logErr(err);
      msg && logErr(msg);
      process.exit(1);
    };
  }

  try {
    const { ignore, manual, verify } = iterTactic || {};
    const versionShellSuffix = ignore ? 'i' : manual ? manual : '';

    if (verify && test) {
      await exec(['npm test'], () => logEmph(italic('单元测试通过！(unit test passed!)')), handleReleaseErr('单元测试失败！(unit test failed!)'));
    }

    if (verify && eslint) {
      await exec(['npm run lint:es'], () => logEmph(italic('eslint校验通过！(eslint passed!)')), handleReleaseErr('eslint校验失败！(eslint checking failed!)'));
    }

    if (verify && stylelint) {
      await exec(['npm run lint:style'], () => logEmph(italic('stylelint校验通过！(stylelint passed!)')), handleReleaseErr('stylelint校验失败！(stylelint checking failed!)'));
    }

    await exec(
      [`${path.resolve(__dirname, 'version.sh')} ${versionShellSuffix}`],
      function () {},
      function () {}
    );

    if (git) {
      let gitUrl = '';
      await exec([
        'git remote get-url origin'
      ], function (results) {
        gitUrl = results[0] && results[0].trim();
      });

      let canPush = true;
      if (git.trim() !== gitUrl) {
        logInfo(`替换当前 ${git.trim()} (remote origin) 为 ${git} (replace ${git.trim()} to ${git})`);
        await exec(
          ['git remote remove origin', `git remote add origin ${git}`],
          () => logEmph(`git remote origin 为 ${git} (git remote origin is: ${git})`),
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
        ? `git push origin ${branch || 'master'}`
        : `git push origin ${branch || 'master'} --no-verify`;

      canPush && await exec(
        [
          'git add -A',
          `${commit}`,
          `${push}`
        ],
        () => logEmph('git仓库push成功！(git-repo push success!)'),
        () => logWarn('git仓库push失败！(git-repo push failed!)')
      );
    }

    if (npm) {
      let npmUrl = '';
      await exec(
        ['npm get registry'],
        function (results) {
          npmUrl = results[0] && results[0].trim();
        }
      );

      if (npm.trim() !== npmUrl && npm.trim() + '/' !== npmUrl) {
        logInfo(`自动设置 npm registry 地址为 ${npm} (auto set npm registry to: ${npm})`);
        await exec(
          [`npm set registry ${npm}`],
          () => logEmph(`npm registry 设置成功，请执行 ${chalk.yellow(underline('npm publish'))} 进行发布！(npm set registry success, please run ${chalk.yellow(underline('npm publish'))} by yourself!)`),
          () => logWarn('npm registry 设置失败！(set npm registry failed!)')
        );
      } else {
        await exec(
          ['npm publish'],
          () => logEmph('npm包发布成功！(npm-package publish success!)'),
          () => logWarn('npm包发布失败！(npm-package publish failed!)')
        );
      }
    }

    // handle release plugins
    const plugin_handles = plugins && getHandlers(plugins, 'release');
    if (plugin_handles) {
      for (const name in plugin_handles) {
        const handler = plugin_handles[name];
        await handler(config as OmniConfig);
      }
    }

    logTime('项目发布', true);
    handleReleaseSuc()();
  } catch (err) {
    logErr(`糟糕！发布过程发生了一点意外 (Oops! release process occured some accidents) \n👉  ${JSON.stringify(err)}`);
    return process.exit(1);
  }
}