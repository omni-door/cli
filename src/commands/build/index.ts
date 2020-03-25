import fs, { readFile } from 'fs';
import path from 'path';
import fsExtra from 'fs-extra';
import shelljs from 'shelljs';
import inquirer from 'inquirer';
import del from 'del';
import rollupConfig from './rollup';
import webpackConfig from './webpack';
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
  output_file,
  node_version
} from '@omni-door/tpl-utils';
import { BUILD } from '@omni-door/tpl-utils';
import { OmniConfig, OmniPlugin } from '../../index.d';
import { getHandlers } from '../../utils/tackle_plugins';
import dependencies_build from './dependencies_build';
import release from '../release';
import logo from '../../utils/logo';

export default async function (config: OmniConfig, buildTactic?: {
  config?: string;
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

  if (!config || JSON.stringify(config) === '{}') {
    logWarn('请先初始化项目！(Please initialize project first!)');
    return process.exit(0);
  }

  const message = '开始构建！(Building process start!)';
  logTime('项目构建');
  logInfo(message);

  const { type, template, build, release: configRelease, plugins } = config || {};

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
    stylelint = false
  } = preflight || {};

  const { config: configPath, verify, buildConfig, configFileName } = buildTactic || {};
  const configurationPath = configPath && path.resolve(process.cwd(), configPath);

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
        message: `${logo} 自动安装所需要的依赖? (Automatic install dependencies?)`,
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

        return exec([
          `${iTool} ${dependencies}`
        ],
        () => {
          logEmph('构建依赖安装完毕！(The dependencies install completed!)');
          return true;
        },
        err => {
          logWarn(`依赖安装发生了错误 (The dependencies install occured some accidents) \n👉  ${JSON.stringify(err)}`);
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
      await exec(['npm test'], () => logEmph(italic('单元测试通过！(The unit test passed!)')), handleBuildErr('单元测试失败！(The unit test failed!)'));
    }

    if (verify && eslint) {
      await exec(['npm run lint:es'], () => logEmph(italic('eslint校验通过！(The eslint passed!)')), handleBuildErr(`eslint校验失败！(The eslint checking failed!) \n 尝试执行 (try to exec): ${underline('npm run lint:es_fix')}`));
    }

    if (verify && stylelint) {
      await exec(['npm run lint:style'], () => logEmph(italic('stylelint校验通过！(The stylelint passed!)')), handleBuildErr(`stylelint校验失败！(The stylelint checking failed!) \n 尝试执行 (try to exec): ${underline('npm run lint:style_fix')}`));
    }

    let realOutDir: string = '';
    const buildCliArr = [];
    if (type === 'component-library-react' || (tool === 'tsc' && type === 'toolkit')) {
      const tscPath = path.resolve(process.cwd(), 'node_modules/typescript/bin/tsc');
      buildCliArr.push(`${tscPath} --outDir ${outDir} --project ${configurationPath || path.resolve(process.cwd(), 'tsconfig.json')}`);
      esmDir && buildCliArr.push(`${tscPath} --module ES6 --target ES6 --outDir ${esmDir} --project ${configurationPath || path.resolve(process.cwd(), 'tsconfig.json')}`);

      if (!fs.existsSync(tscPath)) {
        logWarn('请先安装 typescript! (Please install typescript first!)');
        const is_go_on = await installDenpendencies('tsc');
        if (!is_go_on) return process.exit(0);
      }
      realOutDir = outDir;
    } else {
      const content_rollup = !buildConfig && type === 'toolkit' && rollupConfig({ ts: typescript, multiOutput: true, srcDir, outDir, esmDir, configurationPath, configFileName });
      const content_webpack = !buildConfig && type === 'spa-react' && webpackConfig({ ts: typescript, multiOutput: false, srcDir, outDir, configurationPath, configFileName, hash });
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

        if (!is_go_on) return process.exit(0);

        output_file({
          file_path: buildConfigPath,
          file_content: content_config
        });

        if (type === 'spa-react') {
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
      style && copyStylesheet(srcDir);
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
            verify
          });
        }
      }

      type !== 'toolkit' && spinner.state('stop');
      if (realOutDir && !fs.existsSync(realOutDir)) {
        handleBuildErr(`输出的 ${realOutDir} 文件不存在，构建失败！(The output file ${realOutDir} doesn't exist)`)();
      } else {
        logTime('项目构建', true);
        handleBuildSuc()();
      }
    }, function () {
      type !== 'toolkit' && spinner.state('stop');
      handleBuildErr()();
    });

    if (autoRelease) {
      logInfo('开始自动发布！(Beginning auto release!)');
      try {
        await release(config, { verify: false });
        handleBuildSuc('自动发布成功！(Auto release success!)')();
      } catch (err) {
        handleBuildErr('自动发布失败！(Auto release failed!)')();
      }
    }
  } catch (err) {
    logErr(`糟糕！构建过程发生了点意外！(Oops! Building process occured some accidents!) \n👉  ${JSON.stringify(err)}`);
  }
}