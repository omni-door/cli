import fs from 'fs';
import path from 'path';
import fsExtra from 'fs-extra';
import shelljs from 'shelljs';
import inquirer from 'inquirer';
import ora from 'ora';
import del from 'del';
import rollupConfig from './rollup';
import webpackConfig from './webpack';
import { logErr, logInfo, logWarn, logSuc, logEmph, underline, italic } from '../../utils/logger';
import { execShell } from '../../utils/exec';
import { getHandlers } from '../../utils/tackle_plugins';
import { output_file } from '../../utils/output_file';
import getLogPrefix, { getLogo } from '../../utils/log_prefix';
import node_version from '../../utils/node_version';
import dependencies_build from '../../configs/dependencies_build';
import release from '../release';
import { OmniConfig, BUILD } from '../../index.d';

export default async function (config: OmniConfig | {}, buildTactic?: {
  verify?: boolean;
  buildConfig?: string;
  configFileName?: string;
}) {
  try {
    // node version pre-check
    await node_version('10.13.0');
  } catch (err) {
    logWarn(err);
  }

  if (JSON.stringify(config) === '{}') {
    logWarn('请先初始化项目！(Please initialize project first!)');
    return process.exit(0);
  }

  const message = '开始构建！(Build process start!)';
  logInfo(message);

  const { type,
    build: {
      autoRelease,
      srcDir,
      outDir,
      esmDir = '',
      hash,
      tool,
      reserve = {},
      preflight
    }, plugins } = config as OmniConfig;

  const {
    typescript = false,
    test = false,
    eslint = false,
    stylelint = false
  } = preflight || {};

  const { verify, buildConfig, configFileName } = buildTactic || {};

  if (!outDir || !srcDir) {
    handleBuildErr('配置文件中未定义 $srcDir 或 $outDir (The $srcDir or $outDir were missed in configuration file)')();
  }

  function handleBuildSuc (msg?: string) {
    msg = msg || '恭喜！项目构建成功！(Building completed!)';

    return function () {
      logSuc(msg!);
    };
  }

  function handleBuildErr (msg?: string) {
    msg = msg || '项目构建失败！(Building failed!)';

    return function (err?: string) {
      err && logErr(err);
      msg && logErr(msg);
      return process.exit(1);
    };
  }

  function installDenpendencies (build: BUILD) {
    return inquirer.prompt([
      {
        name: 'install',
        type: 'confirm',
        message: `${getLogo()} 自动安装所需要的依赖? (Automatic install dependencies?)`,
        default: true
      }
    ]).then(answers => {
      const { install } = answers;
      if (install) {
        const dependencies = dependencies_build({ build });

        // install tool pre-check
        let iTool = 'yarn add -D';
        let iToolCheck = shelljs.exec('yarn -v', { async: false });
        if (~iToolCheck.stderr.indexOf('command not found')) {
          iTool = 'cnpm i --save-dev';
          iToolCheck = shelljs.exec('cnpm -v', { async: false });
          if (~iToolCheck.stderr.indexOf('command not found')) {
            iTool = 'npm i --save-dev';
          }
        }

        return execShell([
          `${iTool} ${dependencies}`
        ],
        () => {
          logEmph('构建依赖安装完毕！(dependencies install completed!)');
          return true;
        },
        err => {
          logWarn(`依赖安装发生了错误 (dependencies install occured some accidents) \n👉  ${JSON.stringify(err)}`);
          return false;
        });
      } else {
        return false;
      }
    });
  }

  function copyStylesheet (dir: string, originDir?: string) {
    const list = fs.readdirSync(dir);
    list.map((v, k) => {
      const filePath = path.resolve(dir, v);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        if (!/^.*(test|stories).*$/.test(v)) {
          copyStylesheet(filePath, originDir || dir);
        }
      } else if (/.(css|scss|less)$/.test(v)) {
        const relativePath = path.relative(originDir || dir, filePath);
        const destPath = path.resolve(outDir, relativePath);
        const emsPath = esmDir && path.resolve(esmDir, relativePath);
        fsExtra.ensureDirSync(path.resolve(destPath, '..'));
        fsExtra.copySync(filePath, destPath);
        if (emsPath) {
          fsExtra.ensureDirSync(path.resolve(emsPath, '..'));
          fsExtra.copySync(filePath, emsPath);
        }
      }
    });
  }

  function copyReserves (reserves: string[]) {
    for (let i = 0, len = reserves.length; i < len; i++) {
      const reserveItem = reserves[i];
      let stats;
      try {
        stats = fs.statSync(reserveItem);
      } catch (error) {
        logWarn(`"${reserveItem}" 是一个无效的路径！(The path "${reserveItem}" is invaild!)`);
        continue;
      }
      const relativePath = path.relative(srcDir, reserveItem);
      const destPath = path.resolve(outDir, relativePath);
      const emsPath = esmDir && path.resolve(esmDir, relativePath);
      if (stats.isDirectory()) {
        fsExtra.ensureDirSync(destPath);
        emsPath && fsExtra.ensureDirSync(emsPath);
      } else if (stats.isFile()) {
        fsExtra.ensureDirSync(path.resolve(destPath, '..'));
        emsPath && fsExtra.ensureDirSync(path.resolve(emsPath, '..'));
      } else {
        logWarn(`"${reserveItem}" 不是有效的文件或文件夹路径！(The file or directory path which is "${reserveItem}" cannot be found!)`);
        continue;
      }
      fsExtra.copySync(reserveItem, destPath);
      emsPath && fsExtra.copySync(reserveItem, emsPath);
    }
  }

  try {
    if (verify && test) {
      await execShell(['npm test'], () => logEmph(italic('单元测试通过！(unit test passed!)')), handleBuildErr('单元测试失败！(unit test failed!)'));
    }

    if (verify && eslint) {
      await execShell(['npm run lint:es'], () => logEmph(italic('eslint校验通过！(eslint passed!)')), handleBuildErr(`eslint校验失败！(eslint checking failed!) \n 尝试执行 (try to exec): ${underline('npm run lint:es_fix')}`));
    }

    if (verify && stylelint) {
      await execShell(['npm run lint:style'], () => logEmph(italic('stylelint校验通过！(stylelint passed!)')), handleBuildErr(`stylelint校验失败！(stylelint checking failed!) \n 尝试执行 (try to exec): ${underline('npm run lint:style_fix')}`));
    }

    const buildCliArr = [];
    if (type === 'component-library-react' || (tool === 'tsc' && type === 'toolkit')) {
      const tscPath = path.resolve(process.cwd(), 'node_modules/typescript/bin/tsc');
      buildCliArr.push(`${tscPath} --outDir ${outDir} --project ${path.resolve(process.cwd(), 'tsconfig.json')}`);
      esmDir && buildCliArr.push(`${tscPath} --module ES6 --target ES6 --outDir ${esmDir} --project ${path.resolve(process.cwd(), 'tsconfig.json')}`);

      if (!fs.existsSync(tscPath)) {
        logWarn('请先安装 typescript! (Please install typescript first!)');
        const is_go_on = await installDenpendencies('tsc');
        if (!is_go_on) return;
      }
    } else {
      const content_rollup = !buildConfig && type === 'toolkit' && rollupConfig({ ts: typescript, multiOutput: true, srcDir, outDir, esmDir, configFileName });
      const content_webpack = !buildConfig && type === 'spa-react' && webpackConfig({ ts: typescript, multiOutput: false, srcDir, outDir, configFileName, hash });
      const content_config = buildConfig || content_rollup || content_webpack;
  
      // put temporary file for build process
      if (content_config) {
        const buildConfigPath = path.resolve(__dirname, '../../../', '.omni_cache/build.config.js');

        let is_go_on = true;
        if (type === 'toolkit') {
          const rollupPath = path.resolve(process.cwd(), 'node_modules/rollup/dist/bin/rollup');
          buildCliArr.push(`${rollupPath} -c ${buildConfigPath}`);

          if (!fs.existsSync(rollupPath)) {
            logWarn('请先安装 rollup! (Please install rollup first!)');
            is_go_on = await installDenpendencies('rollup');
          }
        } else if (type === 'spa-react') {
          const webpackPath = path.resolve(process.cwd(), 'node_modules/webpack-cli/bin/cli.js');
          buildCliArr.push(`${webpackPath} --config ${buildConfigPath}`);

          if (!fs.existsSync(webpackPath)) {
            logWarn('请先安装 webpack-cli! (Please install webpack-cli first!)');
            is_go_on = await installDenpendencies('webpack');
          }
        }

        if (!is_go_on) {
          return process.exit(1);
        }

        output_file({
          file_path: buildConfigPath,
          file_content: content_config
        });
      }
    }

    // loading
    const spinner = type !== 'toolkit' && ora(`${getLogPrefix()} 项目构建中 (Building, please wait patiently)  ⏱  \n`);
    spinner && spinner.start();

    del.sync(outDir);
    esmDir && del.sync(esmDir);

    await execShell(buildCliArr, async function () {
      const { style, assets = [] } = reserve;
      style && copyStylesheet(srcDir);
      copyReserves(assets);

      // handle build plugins
      const plugin_handles = plugins && getHandlers(plugins, 'build');
      if (plugin_handles) {
        for (const name in plugin_handles) {
          const handler = plugin_handles[name];
          await handler(config as OmniConfig);
        }
      }

      spinner && spinner.stop();
      if (outDir && !fs.existsSync(outDir)) {
        handleBuildErr(`输出的 ${outDir} 文件不存在，构建失败！`)();
      } else {
        handleBuildSuc()();
      }
    }, function () {
      spinner && spinner.stop();
      handleBuildErr()();
    });

    if (autoRelease) {
      logInfo('开始自动发布！(beginning auto release!)');
      try {
        await release(config, { verify: false });
        handleBuildSuc('自动发布成功！(auto release success!)')();
      } catch (err) {
        handleBuildErr('自动发布失败！(auto release failed!)')();
      }
    }
  } catch (err) {
    logErr(`糟糕！构建过程发生了点意外！(Oops! build process occured some accidents!) \n👉  ${JSON.stringify(err)}`);
  }
}