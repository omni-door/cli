import fs from 'fs';
import path from 'path';
import { execSync } from'child_process';
import fsExtra from 'fs-extra';
import inquirer from 'inquirer';
import del from 'del';
import rollupConfig from './rollup';
import webpackConfig from './webpack';
import gulpConfig from './gulp';
import {
  spinner,
  exec,
  logErr,
  logInfo,
  logWarn,
  logSuc,
  logEmph,
  logTime,
  underline,
  italic,
  outputFile,
  nodeVersionCheck
} from '@omni-door/utils';
import { getHandlers, logo, signal } from '../../utils';
import dependencies_build from './dependencies_build';
import release from '../release';
/* import types */
import type { BUILD } from '@omni-door/utils';
import type { OmniConfig, OmniPlugin } from '../../index.d';

export default async function (
  config: OmniConfig | null,
  buildTactic?: {
    config?: string;
    verify?: boolean;
    buildConfig?: string;
    pkjFieldName?: string;
    configFileName?: string;
  },
  autoBuild?: boolean
) {
  try {
    // node version pre-check
    await nodeVersionCheck('10.13.0');
  } catch (e) {
    logWarn(e);
  }

  if (!config || JSON.stringify(config) === '{}') {
    logWarn('请先初始化项目！(Please initialize project first!)');
    return process.exit(0);
  }

  // bind exit signals
  signal();

  const message = '开始构建！(Building process start!)';
  logTime('项目构建');
  logInfo(message);

  const { type, template, build, release: configRelease, plugins } = config;

  const {
    autoRelease,
    srcDir,
    outDir,
    esmDir = '',
    hash,
    tool,
    reserve = {},
    preflight
  } = build;

  const {
    typescript = false,
    test = false,
    eslint = false,
    prettier = false,
    stylelint = false
  } = preflight || {};

  const CWD = process.cwd();
  const { config: configPath, verify, buildConfig, pkjFieldName, configFileName } = buildTactic || {};
  let configurationPath = configPath && path.resolve(CWD, configPath);
  if (configurationPath && !fs.existsSync(configurationPath)) configurationPath = void(0);

  if (!outDir || !srcDir) {
    handleBuildErr('配置文件中未定义 $srcDir 或 $outDir (The $srcDir or $outDir were missed in configuration file)')();
  }

  function handleBuildSuc (msg?: string) {
    msg = msg || '恭喜！项目构建成功！(Building completed!)';

    return function (isExit?: boolean) {
      logSuc(msg!);
      isExit && process.exit(0);
    };
  }

  function handleBuildErr (msg?: string) {
    msg = msg || '项目构建失败！(Building failed!)';

    return function (err?: string) {
      err && logErr(err);
      msg && logErr(msg);
      type !== 'toolkit' && spinner.state('fail');
      process.exit(1);
    };
  }

  function installDenpendencies (build: BUILD) {
    return inquirer.prompt([
      {
        name: 'install',
        type: 'confirm',
        message: `${logo()} 自动安装所需要的依赖? (Automatic install dependencies?)`,
        default: true
      }
    ]).then(async answers => {
      const { install } = answers;
      if (install) {
        const dependencies = await dependencies_build({ build, project_type: type });

        // install tool pre-check
        let iTool = 'pnpm i --save-dev';
        try {
          execSync('pnpm -v', { stdio: 'ignore' });
        } catch (e) {
          iTool = 'yarn add -D';
          try {
            execSync('yarn -v', { stdio: 'ignore' });
          } catch (e) {
            iTool = 'npm i --save-dev';
          }
        }

        return exec([
          `${iTool} ${dependencies}`
        ],
        () => {
          logEmph('构建依赖安装完毕！(The dependencies install completed!)');
          return true;
        },
        err => {
          logWarn(err);
          logWarn('👆 依赖安装发生了错误 (The dependencies install occured some accidents)');
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
      } else if (/.(css|scss|sass|less)$/.test(v)) {
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

  function copyReserves (reserves: (string | { srcPath: string; relativePath?: string; })[]) {
    for (let i = 0, len = reserves.length; i < len; i++) {
      const reserveItem = reserves[i];
      let srcPath = '';
      let relativePath = '';
      if (typeof reserveItem === 'string') {
        srcPath = reserveItem;
      } else {
        srcPath = reserveItem.srcPath;
        relativePath = reserveItem.relativePath || '';
      }

      let stats;
      try {
        stats = fs.statSync(srcPath);
      } catch (error) {
        logWarn(`"${srcPath}" 是一个无效的路径！(The path of "${srcPath}" is invaild!)`);
        continue;
      }

      relativePath = relativePath || path.relative(srcDir, srcPath);
      const destPath = path.resolve(outDir, relativePath);
      const emsPath = esmDir && path.resolve(esmDir, relativePath);
      if (stats.isDirectory()) {
        fsExtra.ensureDirSync(destPath);
        emsPath && fsExtra.ensureDirSync(emsPath);
      } else if (stats.isFile()) {
        fsExtra.ensureDirSync(path.resolve(destPath, '..'));
        emsPath && fsExtra.ensureDirSync(path.resolve(emsPath, '..'));
      } else {
        logWarn(`"${srcPath}" 不是有效的文件或文件夹路径！(The file or directory path which is "${srcPath}" cannot be found!)`);
        continue;
      }
      fsExtra.copySync(srcPath, destPath);
      emsPath && fsExtra.copySync(srcPath, emsPath);
    }
  }

  try {
    if (verify && test) {
      await exec(['npm test'], () => logEmph(italic('单元测试通过！(The unit test passed!)')), handleBuildErr('单元测试失败！(The unit test failed!)'));
    }

    if (verify && eslint) {
      await exec(['npm run lint:es'], () => logEmph(italic('eslint校验通过！(The eslint passed!)')), handleBuildErr(`eslint校验失败！(The eslint checking failed!) \n 尝试执行 (try to exec): ${underline('npm run lint:es_fix')}`));
    }

    if (verify && prettier) {
      await exec(['npm run lint:prettier'], () => logEmph(italic('prettier校验通过！(The prettier passed!)')), handleBuildErr(`prettier校验失败！(The prettier checking failed!) \n 尝试执行 (try to exec): ${underline('npm run lint:prettier_fix')}`));
    }

    if (verify && stylelint) {
      await exec(['npm run lint:style'], () => logEmph(italic('stylelint校验通过！(The stylelint passed!)')), handleBuildErr(`stylelint校验失败！(The stylelint checking failed!) \n 尝试执行 (try to exec): ${underline('npm run lint:style_fix')}`));
    }

    let realOutDir: string = '';
    const buildCliArr = [];
    const buildCliPath = {
      tsc: path.resolve(CWD, 'node_modules/typescript/bin/tsc'),
      ttsc: path.resolve(CWD, 'node_modules/ttypescript/bin/tsc'),
      rollup: path.resolve(CWD, 'node_modules/rollup/dist/bin/rollup'),
      webpack: path.resolve(CWD, 'node_modules/webpack-cli/bin/cli.js'),
      gulp: path.resolve(CWD, 'node_modules/gulp/bin/gulp.js'),
      next: path.resolve(CWD, 'node_modules/next/dist/bin/next')
    };
    if (tool === 'tsc') {
      if (!typescript) {
        handleBuildErr('已禁用 typescript，无法完成构建！(The typescript had been forbidden!)')();
      }

      let tscPath = buildCliPath.tsc;
      // ttypescript is preferred
      if (fs.existsSync(buildCliPath.ttsc)) tscPath = buildCliPath.ttsc;

      if (!fs.existsSync(tscPath)) {
        logWarn('请先安装 typescript 相关依赖! (Please install typescript first!)');
        const is_go_on = await installDenpendencies('tsc');
        if (!is_go_on) return process.exit(0);
        tscPath = buildCliPath.ttsc;
      }

      buildCliArr.push(`${tscPath} --outDir ${outDir} --project ${configurationPath || path.resolve(CWD, 'tsconfig.json')} --rootDir ${srcDir}`);
      esmDir && buildCliArr.push(`${tscPath} --module ES6 --target ES6 --outDir ${esmDir} --project ${configurationPath || path.resolve(CWD, 'tsconfig.json')} --rootDir ${srcDir}`);
      realOutDir = outDir;
    } else if (type === 'ssr-react') {
      const nextPath = buildCliPath.next;

      if (!fs.existsSync(nextPath)) {
        logWarn('请先安装 webpack 相关依赖! (Please install webpack first!)');
        const is_go_on = await installDenpendencies('next');
        if (!is_go_on) return process.exit(0);
      }

      buildCliArr.push(`${nextPath} build`);
    } else {
      const content_rollup = !buildConfig && type === 'toolkit' && rollupConfig({ ts: typescript, multiOutput: true, srcDir, outDir, esmDir, configurationPath, pkjFieldName, configFileName });
      const content_webpack = !buildConfig && (type === 'spa-react' || type === 'spa-vue') && webpackConfig({ ts: typescript, multiOutput: false, srcDir, outDir, configurationPath, pkjFieldName, configFileName, hash });
      const content_gulp = !buildConfig && type === 'component-react' && gulpConfig({ srcDir, outDir, esmDir });
      const content_config = buildConfig || content_rollup || content_webpack || content_gulp;

      // put temporary file for build process
      if (content_config) {
        const buildConfigPath = path.resolve(__dirname, '../../../', '.omni_cache/build.config.js');

        let is_go_on = true;
        if (type === 'toolkit') {
          const rollupPath = buildCliPath.rollup;

          if (!fs.existsSync(rollupPath)) {
            logWarn('请先安装 rollup 相关依赖! (Please install rollup first!)');
            is_go_on = await installDenpendencies('rollup');
          }

          buildCliArr.push(`${rollupPath} -c ${buildConfigPath}`);
        } else if (type === 'spa-react' || type === 'spa-vue') {
          const webpackPath = buildCliPath.webpack;

          if (!fs.existsSync(webpackPath)) {
            logWarn('请先安装 webpack 相关依赖! (Please install webpack first!)');
            is_go_on = await installDenpendencies('webpack');
          }

          buildCliArr.push(`${webpackPath} --config ${buildConfigPath}`);
        } else if (type === 'component-react') {
          let tscPath = buildCliPath.tsc;
          const gulpPath = buildCliPath.gulp;
          // ttypescript is preferred
          if (fs.existsSync(buildCliPath.ttsc)) tscPath = buildCliPath.ttsc;

          if (typescript && !fs.existsSync(tscPath)) {
            logWarn('请先安装 typescript 相关依赖! (Please install typescript first!)');
            is_go_on = await installDenpendencies('tsc');
            if (is_go_on) tscPath = buildCliPath.ttsc;
          }
          if (is_go_on && !fs.existsSync(gulpPath)) {
            logWarn('请先安装 gulp 相关依赖! (Please install gulp first!)');
            is_go_on = await installDenpendencies('gulp');
          }

          buildCliArr.push(
            typescript ? `${tscPath} --outDir ${outDir} --project ${configurationPath || path.resolve(CWD, 'tsconfig.json')} --emitDeclarationOnly --rootDir ${srcDir}` : '',
            typescript && esmDir ? `${tscPath} --module ES6 --target ES6 --outDir ${esmDir} --project ${configurationPath || path.resolve(CWD, 'tsconfig.json')} --emitDeclarationOnly --rootDir ${srcDir}` : '',
            `${gulpPath} --gulpfile ${buildConfigPath} --cwd ${CWD}`
          );
        }

        if (!is_go_on) return process.exit(0);

        outputFile({
          file_path: buildConfigPath,
          file_content: content_config
        });

        if (type === 'spa-react' || type === 'spa-vue') {
          const bConfig = require(buildConfigPath);
          realOutDir = (bConfig && bConfig.output && bConfig.output.path) || outDir;
        }
      }
    }

    // loading
    if (type !== 'toolkit') {
      spinner.color('green');
      spinner.prefix('moon');
      spinner.state('start', '项目构建中 (Building, please wait patiently)');
    }

    del.sync(realOutDir || outDir);
    esmDir && del.sync(esmDir);

    await exec(buildCliArr, async function () {
      const { style, assets = [] } = reserve;
      if (type !== 'component-react' && style) copyStylesheet(srcDir);
      copyReserves(assets);

      // handle build plugins
      const plugin_handles = plugins && plugins.length > 0 && getHandlers<'build'>(plugins as OmniPlugin<'build'>[], 'build');
      if (plugin_handles) {
        for (const name in plugin_handles) {
          const handler = plugin_handles[name];
          await handler({
            type,
            template,
            build,
            release: configRelease
          }, {
            verify,
            buildConfig
          });
        }
      }

      if (realOutDir && !fs.existsSync(realOutDir)) {
        handleBuildErr(`输出的 ${realOutDir} 文件不存在，构建失败！(The output file ${realOutDir} doesn't exist)`)();
      } else {
        type !== 'toolkit' && spinner.state('stop');
        logTime('项目构建', true);
        const shouldExit = !(autoRelease || autoBuild);
        handleBuildSuc()(shouldExit);
      }
    }, handleBuildErr());

    // auto release
    if (!autoBuild && autoRelease) {
      logInfo('开始自动发布！(Start auto release!)');
      try {
        await release(config, { verify: false }, autoRelease);
        handleBuildSuc('自动发布成功！(Auto release success!)')(true);
      } catch (err) {
        handleBuildErr('自动发布失败！(Auto release failed!)')();
      }
    }
  } catch (err) {
    logErr(err);
    handleBuildErr('👆 糟糕！构建过程发生了点意外！(Oops! Building process occured some accidents!)')();
  }
}