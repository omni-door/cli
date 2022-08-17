import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import semver from 'semver';
import chalk from 'chalk';
import {
  exec, 
  logErr,
  logInfo,
  logWarn,
  logSuc,
  logCongrat,
  logEmph,
  logTime,
  italic,
  underline,
  nodeVersionCheck,
  getNpmVersions,
  logPrefix
} from '@omni-door/utils';
import { spawn, execSync } from 'child_process';
import { getHandlers, signal, logo } from '../../utils';
import buildCommands from '../build';
/* import types */
import type { OmniConfig, OmniPlugin } from '../../index.d';

const tagCustom = '$omni_custom$';

const tagDict = {
  '1. alpha (内测版)': 'alpha',
  '2. beta (公测版)': 'beta',
  '3. rc (内测版)': 'rc',
  '4. latest (正式版)': 'latest',
  '5. custom (自定义)': tagCustom
};

const tagDictWithExtraWords = {
  '1. alpha (内测版 - 当前标签)': 'alpha',
  '2. beta (公测版 - 当前标签)': 'beta',
  '3. rc (内测版 - 当前标签)': 'rc',
  '4. latest (正式版 - 当前标签)': 'latest'
};

const iterDict = {
  automatic: '1. automatic(自动)',
  manual: '2. manual(手动)',
  ignore: '3. ignore(忽略)'
};

function getAutoIterDict (version: string, tag: string) {
  if (tag === 'latest') {
    return {
      [`1. patch (${version} -> ${semver.inc(version, 'patch')})`]: ['latest', semver.inc(version, 'patch')],
      [`2. minor (${version} -> ${semver.inc(version, 'minor')})`]: ['latest', semver.inc(version, 'minor')],
      [`3. major (${version} -> ${semver.inc(version, 'major')})`]: ['latest', semver.inc(version, 'major')]
    };
  }

  if (tag === 'rc') {
    return {
      [`1. pre-release (${version} -> ${semver.inc(version, 'prerelease', tag)})`]: [tag || 'prerelease', semver.inc(version, 'prerelease', tag)],
      [`2. patch (${version} -> ${semver.inc(version, 'patch')})`]: ['latest', semver.inc(version, 'patch')],
      [`3. minor (${version} -> ${semver.inc(version, 'minor')})`]: ['latest', semver.inc(version, 'minor')],
      [`4. major (${version} -> ${semver.inc(version, 'major')})`]: ['latest', semver.inc(version, 'major')]
    };
  }

  return {
    [`1. pre-release (${version} -> ${semver.inc(version, 'prerelease', tag)})`]: [tag || 'prerelease', semver.inc(version, 'prerelease', tag)],
    [`2. pre-patch (${version} -> ${semver.inc(version, 'prepatch', tag)})`]: [tag || 'prepatch', semver.inc(version, 'prepatch', tag)],
    [`3. pre-minor (${version} -> ${semver.inc(version, 'preminor', tag)})`]: [tag || 'preminor', semver.inc(version, 'preminor', tag)],
    [`4. pre-major (${version} -> ${semver.inc(version, 'premajor', tag)})`]: [tag || 'premajor', semver.inc(version, 'premajor', tag)],
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
    logWarn(e as string);
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
    msg = msg || 'Release completed (发布完成)!';

    return function (isExit?: boolean) {
      logCongrat(msg!);
      isExit && process.exit(0);
    };
  }

  function handleReleaseErr (msg?: string) {
    msg = msg || 'Release failed (发布失败)!';

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
      delete require.cache[pkjPath]; // delete cache in order to avoid version may not correct
      pkj = require(pkjPath);
    }
    return pkj;
  }

  try {
    // eslint-disable-next-line prefer-const
    let { automatic, ignore, manual, tag, verify, ...rest } = iterTactic || {};

    // package.json data
    const pkjPath = path.resolve(process.cwd(), 'package.json');
    let pkj = getPkjData(pkjPath);

    // the version for iteration
    let iterVersion = manual || (typeof automatic === 'string' ? automatic : '') || pkj.version;
    // whether or not need iteration
    const needIteration = ignore === void 0 && manual === void 0 && automatic === void 0;

    const versionErrMsg = `Please input valid version (请输入有效的版本号)\n
    Reference to (版本号规则可参考): https://semver.org/`;
    const tagErrMsg = 'The tag can only contain letters (标签只能包含字母)';
    const versionRepeatMsg = (ver: string) => `The ${ver} is not available (${ver} 不可用)`;

    const existedVersions = [] as string[];
    let versionsPromise = Promise.resolve();
    if (npm) {
      versionsPromise = getNpmVersions(pkj.name, { registry: typeof npm === 'string' ? npm : void 0 })
        .then(res => { existedVersions.push(...res); });
    }

    // infer the tag which according to the version
    const defaultTag = manual
      ? manual.match(/[a-zA-Z]+/g)?.[0] ?? 'latest'
      : pkj?.version?.match(/[a-zA-Z]+/g)?.[0] ?? 'latest';

    // automatic interation dictionary
    const autoIterDict = {} as Record<string, [string, string]>;

    if (needIteration || (npm && !tag)) {
      await new Promise((resolve, reject) => {
        inquirer.prompt([
          {
            name: 'presetTag',
            type: 'list',
            when: () => npm && !tag && !autoTag,
            choices: () => {
              const result = Object.keys(tagDict);
              const presetTags = Object.values(tagDict);
              if (!presetTags.some(v => v === defaultTag)) {
                const key = `0. ${defaultTag} (当前标签)`;
                result.unshift(key);
                tagDictWithExtraWords[key as keyof typeof tagDictWithExtraWords] = defaultTag;
              } else {
                const ind = presetTags.indexOf(defaultTag);
                const preset = result[ind];
                result.splice(ind, 1, preset.replace(')', ' - 当前标签)'));
              }
              return result;
            },
            default: () => {
              const result = Object.keys(tagDict);
              const presetTags = Object.values(tagDict);
              if (presetTags.some(v => v === defaultTag)) {
                return result[presetTags.indexOf(defaultTag)].replace(')', ' - 当前标签)');
              }
            },
            message: 'Choose the tag (选择标签):'
          },
          {
            name: 'label',
            type: 'input',
            when: answer => tagDict[answer.presetTag as keyof typeof tagDict] === tagCustom,
            default: () => {
              if (defaultTag === 'rc') return 'latest';
              return defaultTag;
            },
            validate: val => {
              if (/^[a-zA-Z]+$/g.test(val)) {
                return true;
              }
              return tagErrMsg;
            },
            message: `${logo()}Input the tag (输入标签):`
          },
          {
            name: 'iter',
            type: 'list',
            when: () => needIteration,
            choices: [ iterDict.automatic, iterDict.manual, iterDict.ignore ],
            message: `${logo()}Select the way of iteration (选择迭代方式):`
          },
          {
            name: 'version_semantic',
            type: 'list',
            when: answer => answer.iter === iterDict.automatic,
            choices: (answer) => {
              Object.assign(autoIterDict, getAutoIterDict(pkj.version, answer.label || tagDict[answer.presetTag as keyof typeof tagDict] || tagDictWithExtraWords[answer.presetTag as keyof typeof tagDictWithExtraWords] || defaultTag));
              return [ ...Object.keys(autoIterDict) ];
            },
            message: `${logo()}Select the version (选择版本):`
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
            message: `${logo()}Input the version (输入版本号):`
          },
          {
            name: 'changeVersion',
            type: 'confirm',
            message: () => {
              const currentVer = iterVersion;
              const type = tag === 'latest' ? 'patch' : 'prerelease';
              while(~existedVersions.indexOf(iterVersion)) {
                iterVersion = semver.inc(iterVersion, type, tag)!;
              }

              return `The ${chalk.strikethrough.red(currentVer)} had been occupied, would you like change to ${chalk.bold.underline.green(iterVersion)}?`;
            },
            when: async (answer) => {
              if (!npm) return false;
              const { version_manual, version_semantic, presetTag, label } = answer;
              iterVersion = version_manual || autoIterDict[version_semantic]?.[1] || iterVersion;
              const versionTag = iterVersion?.match(/[a-zA-Z]+/g)?.[0];
              tag = label
              || tagDict[presetTag as keyof typeof tagDict]
              || tagDictWithExtraWords[presetTag as keyof typeof tagDictWithExtraWords]
              || (versionTag === 'rc' ? 'latest' : versionTag)
              || autoIterDict[version_semantic]?.[0]
              || defaultTag;
              await versionsPromise;
              return existedVersions.some(v => iterVersion === v);
            }
          }
        ])
          .then(answers => {
            const { iter, version_semantic, version_manual, changeVersion } = answers;
            if (changeVersion === false) {
              const currentVer = version_manual ?? autoIterDict[version_semantic]?.[1] ?? '';
              logWarn(versionRepeatMsg(currentVer));
              process.exit(1);
            }

            switch (iter) {
              case iterDict.automatic:
                // eslint-disable-next-line no-case-declarations
                automatic = iterVersion ?? true;
                break;
              case iterDict.manual:
                manual = iterVersion;
                break;
              case iterDict.ignore:
                ignore = true;
                break;
            }

            resolve(void 0);
          })
          .catch(handleReleaseErr());
      });
    } else if (npm) {
      await versionsPromise;
      if (~existedVersions.indexOf(iterVersion)) {
        logWarn(versionRepeatMsg(iterVersion));
        process.exit(0);
      }
    }

    if (manual && !semver.valid(manual)) {
      logWarn(versionErrMsg);
      process.exit(0);
    }

    // auto build
    if (autoBuild && !autoRelease) {
      logEmph(italic('Start building the project automatically'));
      logEmph(italic('开始自动构建项目'));
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
      await exec(['npm test'], () => logSuc('Unit Test!'), handleReleaseErr('The unit test not pass(单元测试失败)'));
    }

    if (!autoBuild && verify && eslint) {
      await exec(['npm run lint:es'], () => logSuc('Eslint!'), handleReleaseErr(`The eslint not pass(eslint校验失败) \n try to exec(尝试执行): ${underline('npm run lint:es_fix')}`));
    }

    if (!autoBuild && verify && prettier) {
      await exec(['npm run lint:prettier'], () => logSuc('Prettier!'), handleReleaseErr(`The prettier not pass(prettier校验失败) \n try to exec(尝试执行): ${underline('npm run lint:prettier_fix')}`));
    }

    if (!autoBuild && verify && stylelint) {
      await exec(['npm run lint:style'], () => logSuc('Stylelint!'), handleReleaseErr(`The stylelint not pass(stylelint校验失败) \n try to exec(尝试执行): ${underline('npm run lint:style_fix')}`));
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
          logSuc('Pushing to git-repo successfully!');
          logSuc('git仓库推送成功！');
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
            logSuc(`The npm-package publish success with version ${pkj.version}@${tag}!`);
            logSuc(`npm包发布成功, 版本号为 ${pkj.version}@${tag}！`);
            resolve(null);
          } else {
            reject();
          }
        });
      });
    }

    logTime('RELEASE(发布)', true);
    const shouldExit = !autoRelease;
    handleReleaseSuc()(shouldExit);
  } catch (err) {
    logErr(err as string);
    handleReleaseErr('👆 Oops! release process occured some accidents(糟糕！发布过程发生了一点意外)')();
  }
}