import fs from 'fs';
import path from 'path';
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
  node_version,
  logPrefix
} from '@omni-door/utils';
import { OmniConfig, OmniPlugin } from '../../index.d';
import { getHandlers } from '../../utils/tackle_plugins';

export default async function (config: OmniConfig, iterTactic?: {
  ignore?: boolean;
  manual?: string;
  verify?: boolean;
  tag?: string;
}) {
  try {
    // node version pre-check
    await node_version('8');
  } catch (err) {
    logWarn(err);
  }

  if (!config || JSON.stringify(config) === '{}') {
    logWarn('请先初始化项目！(Please initialize project first!)');
    process.exit(0);
  }

  logTime('项目发布');
  const { type, template, build, release = {}, plugins } = config;
  const {
    git,
    npm,
    preflight
  } = release;
  const {
    test = false,
    eslint = false,
    prettier = false,
    stylelint = false,
    commitlint = false,
    branch
  } = preflight || {};

  if (branch) {
    // branch check
    let branchInfo = '';
    await exec(
      [`${path.resolve(__dirname, 'branch.sh')} ${branch} "${logPrefix()}"`],
      function (results) { branchInfo = results[0]; },
      function () { process.exit(1); }
    );
    if (!~branchInfo.indexOf('current branch is')) {
      // branch check failed!
      return;
    }
  }

  const message = '开始发布！(Starting release process!)';
  logInfo(message);

  function handleReleaseSuc (msg?: string) {
    msg = msg || '恭喜！发布完成！(The release process completed!)';

    return function () {
      logSuc(msg!);
    };
  }

  function handleReleaseErr (msg?: string) {
    msg = msg || '发布失败！(release failed!)';

    return function (err?: string) {
      err && logErr(err);
      msg && logErr(msg);
      process.exit(1);
    };
  }

  try {
    const { ignore, manual, tag = 'latest', verify } = iterTactic || {};
    const versionShellSuffix = ignore ? 'i' : manual ? manual : '';

    if (verify && test) {
      await exec(['npm test'], () => logEmph(italic('单元测试通过！(The unit test passed!)')), handleReleaseErr('单元测试失败！(The unit test failed!)'));
    }

    if (verify && eslint) {
      await exec(['npm run lint:es'], () => logEmph(italic('eslint校验通过！(The eslint passed!)')), handleReleaseErr(`eslint校验失败！(The eslint checking failed!) \n 尝试执行 (try to exec): ${underline('npm run lint:es_fix')}`));
    }

    if (verify && prettier) {
      await exec(['npm run lint:prettier'], () => logEmph(italic('prettier校验通过！(The prettier passed!)')), handleReleaseErr(`prettier校验失败！(The prettier checking failed!) \n 尝试执行 (try to exec): ${underline('npm run lint:prettier_fix')}`));
    }

    if (verify && stylelint) {
      await exec(['npm run lint:style'], () => logEmph(italic('stylelint校验通过！(The stylelint passed!)')), handleReleaseErr(`stylelint校验失败！(The stylelint checking failed!) \n 尝试执行 (try to exec): ${underline('npm run lint:style_fix')}`));
    }

    await exec(
      [`${path.resolve(__dirname, 'version.sh')} "${logPrefix()}" ${versionShellSuffix}`],
      () => logEmph('版本迭代成功！(The version iteration success!)'),
      handleReleaseErr('版本迭代失败！(The version iteration failed!)')
    );

    if (git) {
      const gitUrl = git.trim();
      let gitOriginUrl = '';
      let gitOmniUrl = '';
      await exec([
        'git remote get-url origin'
      ], function (results) {
        gitOriginUrl = results[0] && results[0].trim();
      }, () => {}, true);
      await exec([
        'git remote get-url omni'
      ], function (results) {
        gitOmniUrl = results[0] && results[0].trim();
      }, () => {}, true);

      let canPush = true;
      let remote = gitUrl === gitOmniUrl ? 'omni' : 'origin';
      if (gitUrl !== gitOriginUrl && gitUrl !== gitOmniUrl) {
        !gitOmniUrl && logInfo(`新增远程地址omni ${git} (Adding remote omni ${git})`);
        const execArr = ['git remote remove omni', `git remote add omni ${git}`];
        !gitOmniUrl && execArr.shift(); // remote没有omni，移除remove操作

        await exec(
          execArr,
          () => {
            logEmph(`git remote omni 为 ${git} (git remote omni is: ${git})`);
            remote = 'omni';
          },
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
        ? `git push ${remote} ${branch || 'master'}`
        : `git push ${remote} ${branch || 'master'} --no-verify`;

      canPush && await exec(
        [
          'git add -A',
          `${commit}`,
          `${push}`
        ],
        () => logEmph('git仓库push成功！(Pushing to git-repo success!)'),
        handleReleaseErr('git仓库push失败！(Pushing to git-repo failed!)')
      );
    }

    if (npm) {
      let npmUrl = '';
      await exec(
        ['npm get registry'],
        function (results) {
          npmUrl = results[0] && results[0].trim();
        }, () => {}, true
      );

      await exec(
        [`npm publish --registry=${npm || npmUrl} --tag=${tag}`],
        () => logEmph('npm包发布成功！(The npm-package publish success!)'),
        handleReleaseErr('npm包发布失败！(The npm-package publish failed!)')
      );
    }

    // handle release plugins
    const plugin_handles = plugins && plugins.length > 0 && getHandlers<'release'>(plugins as OmniPlugin<'release'>[], 'release');
    if (plugin_handles) {
      const pkj = require(path.resolve(process.cwd(), 'package.json'));
      const version = pkj ? pkj.version : 'unknown';
      for (const name in plugin_handles) {
        const handler = plugin_handles[name];
        await handler({
          type,
          template,
          build,
          release
        }, {
          version: ignore ? 'ignore' : version,
          verify,
          tag
        });
      }
    }

    logTime('项目发布', true);
    handleReleaseSuc()();
  } catch (err) {
    handleReleaseErr(`糟糕！发布过程发生了一点意外 (Oops! release process occured some accidents) \n👉  ${JSON.stringify(err)}`)();
  }
}