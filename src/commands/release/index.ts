import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import semver from 'semver';
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
import { getHandlers, signal, logo } from '../../utils';

const iterDict = {
  automatic: '自动迭代 (automatic)',
  manual: '手动迭代 (manual)',
  ignore: '忽视迭代 (ignore)'
};

export default async function (
  config: OmniConfig,
  iterTactic?: {
    automatic?: boolean;
    ignore?: boolean;
    manual?: string;
    verify?: boolean;
    tag?: string;
  },
  autoRelease?: boolean
) {
  try {
    // node version pre-check
    await node_version('8');
  } catch (e) {
    logWarn(e);
  }

  if (!config || JSON.stringify(config) === '{}') {
    logWarn('请先初始化项目！(Please initialize project first!)');
    process.exit(0);
  }

  // bind exit signals
  signal();

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

  function handleReleaseSuc (msg?: string) {
    msg = msg || '恭喜！发布完成！(The release process completed!)';

    return function (isExit?: boolean) {
      logSuc(msg!);
      isExit && process.exit(0);
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

  function getPkjData (pkjPath: string) {
    let pkj = {
      name: 'OMNI-PROJECT',
      version: '0.0.1'
    };
    if (fs.existsSync(pkjPath)) {
      delete require.cache[pkjPath]; // 删除缓存避免版本号不正确
      pkj = require(pkjPath);
    }
    return pkj;
  }

  try {
    let { automatic, ignore, manual, tag, verify } = iterTactic || {};
    const hasIter = !(ignore === void 0 && manual === void 0 && automatic === void 0);
    const versionErrMsg = `请输入有效的版本号 (Please input valid version)\n
    版本号规则可参考: https://semver.org/ (Reference to: https://semver.org/)`;
    const pkjPath = path.resolve(process.cwd(), 'package.json');

    if (!hasIter || (npm && !tag)) {
      await new Promise((resolve, reject) => {
        inquirer.prompt([
          {
            name: 'iter',
            type: 'list',
            when: () => !hasIter,
            choices: [ iterDict.automatic, iterDict.manual, iterDict.ignore ],
            message: `${logo()}请选择迭代策略 (Please choice iteration strategy)：`
          },
          {
            name: 'version',
            type: 'input',
            when: answer => answer.iter === iterDict.manual,
            validate: val => {
              if (!semver.valid(val)) {
                console.info('\n');
                logWarn(versionErrMsg);
                return false;
              }
              return true;
            },
            message: `${logo()}请输入迭代的版本号 (Please input the iteration version):`
          },
          {
            name: 'label',
            type: 'input',
            when: () => npm && !tag,
            default: 'latest',
            message: `${logo()}请输入迭代的标签 (Please input the iteration tag):`
          }
        ])
          .then(answers => {
            const { iter, version, label } = answers;
            if (label) tag = label;
            switch (iter) {
              case iterDict.automatic:
                automatic = true;
                break;
              case iterDict.manual:
                manual = version;
                break;
              case iterDict.ignore:
                ignore = true;
                break;
            }
            resolve();
          })
          .catch(handleReleaseErr());
      });
    }

    if (manual && !semver.valid(manual)) {
      logWarn(versionErrMsg);
      process.exit(0);
    }

    logTime('项目发布');
    logInfo('开始发布！(Starting release process!)');
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

    const versionShellSuffix = ignore ? 'i' : manual ? manual : '';
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

      const pkj = getPkjData(pkjPath);

      const commit = commitlint && !verify
        ? `git commit -m'[${pkj.name.toUpperCase()}]: ${pkj.version}' --no-verify`
        : `git commit -m'[${pkj.name.toUpperCase()}]: ${pkj.version}'`;

      const push = commitlint && !verify
        ? `git push ${remote} ${branch || 'master'} --no-verify`
        : `git push ${remote} ${branch || 'master'}`;

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
      const pkj = getPkjData(pkjPath);
      const version = pkj ? pkj.version : 'unknown';
      const versionIterTactic = ignore ? 'ignore' : manual ? 'manual' : 'auto';
      for (const name in plugin_handles) {
        const handler = plugin_handles[name];
        await handler({
          type,
          template,
          build,
          release
        }, {
          version,
          versionIterTactic,
          verify,
          tag
        });
      }
    }

    logTime('项目发布', true);
    handleReleaseSuc()(!autoRelease);
  } catch (err) {
    logErr(err);
    handleReleaseErr('👆 糟糕！发布过程发生了一点意外 (Oops! release process occured some accidents)')();
  }
}