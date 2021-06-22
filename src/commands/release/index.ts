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
  nodeVersionCheck,
  logPrefix
} from '@omni-door/utils';
import { spawn, execSync } from 'child_process';
import { getHandlers, signal, logo } from '../../utils';
import buildCommands from '../build';
/* import types */
import type { OmniConfig, OmniPlugin } from '../../index.d';

const iterDict = {
  automatic: 'automatic(自动)',
  manual: 'manual(手动)',
  ignore: 'ignore(忽略)'
};

const releaseSemverTag = {
  patch: 'latest',
  minor: 'latest',
  major: 'latest',
  prepatch: 'prepatch',
  preminor: 'preminor',
  premajor: 'premajor',
  prerelease: 'prerelease'
};

function getAutoIterDict (version: string) {
  return {
    [`1. pre-release (${version} -> ${semver.inc(version, 'prerelease')})`]: 'prerelease',
    [`2. pre-patch (${version} -> ${semver.inc(version, 'prepatch')})`]: 'prepatch',
    [`3. patch (${version} -> ${semver.inc(version, 'patch')})`]: 'patch',
    [`4. pre-minor (${version} -> ${semver.inc(version, 'preminor')})`]: 'preminor',
    [`5. minor (${version} -> ${semver.inc(version, 'minor')})`]: 'minor',
    [`6. pre-major (${version} -> ${semver.inc(version, 'premajor')})`]: 'premajor',
    [`7. major (${version} -> ${semver.inc(version, 'major')})`]: 'major'
  };
}

export default async function (
  config: OmniConfig | null,
  iterTactic?: {
    automatic?: boolean | string;
    ignore?: boolean;
    manual?: string;
    verify?: boolean;
    tag?: string;
    config?: string;
    buildConfig?: string;
    pkjFieldName?: string;
    configFileName?: string;
  },
  autoRelease?: boolean
) {
  try {
    // node version pre-check
    await nodeVersionCheck('8');
  } catch (e) {
    logWarn(e);
  }

  if (!config || JSON.stringify(config) === '{}') {
    logWarn('Please initialize project first');
    logWarn('请先初始化项目');
    process.exit(0);
  }

  // bind exit signals
  signal();

  const { type, template, build, release = {}, plugins } = config;
  const {
    git,
    npm,
    autoBuild,
    autoTag,
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
    msg = msg || 'Release completed(发布完成)!';

    return function (isExit?: boolean) {
      logSuc(msg!);
      isExit && process.exit(0);
    };
  }

  function handleReleaseErr (msg?: string) {
    msg = msg || 'Release failed(发布失败)!';

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
    // eslint-disable-next-line prefer-const
    let { automatic, ignore, manual, tag, verify, ...rest } = iterTactic || {};
    const hasIter = !(ignore === void 0 && manual === void 0 && automatic === void 0);
    const versionErrMsg = `Please input valid version(请输入有效的版本号)\n
    Reference to(版本号规则可参考): https://semver.org/`;
    const pkjPath = path.resolve(process.cwd(), 'package.json');
    let pkj = getPkjData(pkjPath);
    const defaultTag = manual
      ? manual.match(/[a-zA-Z]+/g)?.[0] ?? 'latest'
      : pkj?.version?.match(/[a-zA-Z]+/g)?.[0] ?? 'latest';
    const autoIterDict = getAutoIterDict(pkj.version);

    if (!hasIter || (npm && !tag)) {
      await new Promise((resolve, reject) => {
        inquirer.prompt([
          {
            name: 'iter',
            type: 'list',
            when: () => !hasIter,
            choices: [ iterDict.automatic, iterDict.manual, iterDict.ignore ],
            message: `${logo()}Select the way of iteration(选择迭代方式):`
          },
          {
            name: 'version_semantic',
            type: 'list',
            when: answer => answer.iter === iterDict.automatic,
            choices: [ ...Object.keys(autoIterDict) ],
            message: `${logo()}Select the version(选择版本)`
          },
          {
            name: 'version_manual',
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
            message: `${logo()}Input the version(输入版本号):`
          },
          {
            name: 'label',
            type: 'input',
            when: () => npm && !tag && !autoTag,
            default: (answer: any) => {
              if (answer.version) {
                return answer.version.match(/[a-zA-Z]+/g)?.[0] ?? 'latest';
              }
              return defaultTag;
            },
            message: `${logo()}Input the npm publish tag(输入 npm 发布标签):`
          }
        ])
          .then(answers => {
            const { iter, version_semantic, version_manual, label } = answers;
            const releaseType = autoIterDict[version_semantic]; 
            const version = version_manual ?? (version_semantic ? semver.inc(pkj.version, releaseType as any) : '');
            tag = label || version?.match(/[a-zA-Z]+/g)?.[0] || releaseSemverTag[releaseType as keyof typeof releaseSemverTag] || defaultTag;

            switch (iter) {
              case iterDict.automatic:
                // eslint-disable-next-line no-case-declarations
                automatic = semver.inc(pkj.version, releaseType as any) ?? true;
                break;
              case iterDict.manual:
                manual = version_manual;
                break;
              case iterDict.ignore:
                ignore = true;
                break;
            }

            resolve(void 0);
          })
          .catch(handleReleaseErr());
      });
    }

    if (manual && !semver.valid(manual)) {
      logWarn(versionErrMsg);
      process.exit(0);
    }

    // auto build
    if (autoBuild && !autoRelease) {
      logInfo('Start building the project automatically');
      logInfo('开始自动构建项目');
      try {
        await buildCommands(
          config,
          {
            ...rest,
            verify
          },
          true
        );
      } catch (err) {
        handleReleaseErr('Auto building the project failed(自动构建项目失败)!')();
      }
    }

    logTime('RELEASE(发布)');
    logInfo('Starting release process(开始发布)!');
    if (!autoBuild && verify && test) {
      await exec(['npm test'], () => logEmph(italic('Unit Test!')), handleReleaseErr('The unit test not pass(单元测试失败)'));
    }

    if (!autoBuild && verify && eslint) {
      await exec(['npm run lint:es'], () => logEmph(italic('Eslint!')), handleReleaseErr(`The eslint not pass(eslint校验失败) \n try to exec(尝试执行): ${underline('npm run lint:es_fix')}`));
    }

    if (!autoBuild && verify && prettier) {
      await exec(['npm run lint:prettier'], () => logEmph(italic('Prettier!')), handleReleaseErr(`The prettier not pass(prettier校验失败) \n try to exec(尝试执行): ${underline('npm run lint:prettier_fix')}`));
    }

    if (!autoBuild && verify && stylelint) {
      await exec(['npm run lint:style'], () => logEmph(italic('Stylelint!')), handleReleaseErr(`The stylelint not pass(stylelint校验失败) \n try to exec(尝试执行): ${underline('npm run lint:style_fix')}`));
    }

    const versionShellSuffix = ignore
      ? 'i'
      : manual
        ? `m ${manual}`
        : typeof automatic === 'string'
          ? `a ${automatic}`
          : '';
    await exec(
      [`${path.resolve(__dirname, 'version.sh')} "${logPrefix()}" ${versionShellSuffix}`],
      () => {
        // re-require to get correct version
        pkj = getPkjData(pkjPath);
        logEmph(`The current version is ${pkj.version}`);
        logEmph(`当前版本号为 ${pkj.version}`);
      },
      handleReleaseErr('The version iteration failed(版本迭代失败)!')
    );

    const hasChange = !!execSync('git status -s').toString();
    if (git && hasChange) {
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
        !gitOmniUrl && logInfo(`Adding remote omni ${git}(新增远程地址omni ${git})`);
        const execArr = ['git remote remove omni', `git remote add omni ${git}`];
        !gitOmniUrl && execArr.shift(); // remote没有omni，移除remove操作

        await exec(
          execArr,
          () => {
            logEmph(`git remote omni: ${git}`);
            remote = 'omni';
          },
          () => {
            logWarn('setting git remote failed');
            logWarn('git remote 设置失败');
            canPush = false;
          }
        );
      }

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
        () => {
          logEmph('Pushing to git-repo successfully!');
          logEmph('git仓库推送成功！');
        },
        handleReleaseErr('Pushing to git-repo failed(git仓库推送失败)!')
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

      await new Promise((resolve, reject) => {
        const npm_publish = spawn(
          'npm',
          [
            'publish',
            `--registry=${(npm && typeof npm === 'string') ? npm : npmUrl}`,
            `--tag=${tag}`,
            '--access public'
          ],
          {
            detached: true,
            stdio: 'inherit'
          }
        );
  
        if (npm_publish.stdout) {
          npm_publish.stdout.on('data', data => {
            console.info(data.toString());
          });
        }

        if (npm_publish.stderr) {
          npm_publish.stderr.on('data', data => {
            console.info(data.toString());
          });
        }

        npm_publish.on('error', handleReleaseErr('The npm-package publish failed(npm包发布失败)!'));

        npm_publish.on('close', code => {
          if (code === 0) {
            logEmph(`The npm-package publish success with version ${pkj.version}@${tag}!`);
            logEmph(`npm包发布成功, 版本号为 ${pkj.version}@${tag}！`);
            resolve(null);
          } else {
            reject();
          }
        });
      });
    }

    // handle release plugins
    const plugin_handles = plugins && plugins.length > 0 && getHandlers<'release'>(plugins as OmniPlugin<'release'>[], 'release');
    if (plugin_handles) {
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

    logTime('RELEASE(发布)', true);
    const shouldExit = !autoRelease;
    handleReleaseSuc()(shouldExit);
  } catch (err) {
    logErr(err);
    handleReleaseErr('👆 Oops! release process occured some accidents(糟糕！发布过程发生了一点意外)')();
  }
}