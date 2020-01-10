import fs from 'fs';
import path from 'path';
import fsExtra from 'fs-extra';
import shelljs from 'shelljs';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import del from 'del';
import rollupConfig from './rollup';
import webpackConfig from './webpack';
import { logErr, logInfo, logWarn, logSuc, logEmph } from '../../utils/logger';
import { execShell } from '../../utils/exec';
import { getHandlers } from '../../utils/tackle_plugins';
import getBrand from '../../utils/brand';
import { OmniConfig, BUILD } from '../../index.d';
import dependencies_build from '../../configs/dependencies_build';

export default async function (config: OmniConfig | {}, buildTactic?: {
  verify?: boolean;
}) {
  if (JSON.stringify(config) === '{}') {
    logWarn('请先初始化项目！(Please Initialize project first!)');
    return;
  }

  const message = '开始构建！(Build process start!)';
  logInfo(message);

  const { build: {
    tool,
    multi_output = false,
    typescript = false,
    test = false,
    eslint = false,
    stylelint = false,
    reserve = {},
    src_dir,
    out_dir,
    esm_dir = '',
    auto_release
  }, plugins } = config as OmniConfig;

  const { verify } = buildTactic || {};

  if (!out_dir || !src_dir) {
    handleBuildErr('[omni.config.js]文件中未定义$src_dir 或 $out_dir (The $src_dir or $out_dir were missed in [omni.config.js])')();
  }

  function handleBuildSuc (msg?: string) {
    msg = msg || '恭喜！项目构建成功！(Building completed!)';

    return function () {
      logSuc(msg!);
    };
  }

  function handleBuildErr (msg?: string) {
    msg = msg || '项目构建失败！(Building failed!)';

    return function (err?: any) {
      logErr(msg!);
      return process.exit(1);
    };
  }

  function installDenpendencies (build: BUILD) {
    return inquirer.prompt([
      {
        name: 'install',
        type: 'confirm',
        message: '自动安装所需要的依赖? (Automatic install dependencies?)',
        default: true
      }
    ]).then(answers => {
      const { install } = answers;
      if (install) {
        const dependencies = dependencies_build({ build }).join(' ');

        // install tool precheck
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
        const destPath = path.resolve(out_dir, relativePath);
        const emsPath = esm_dir && path.resolve(esm_dir, relativePath);
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
      const relativePath = path.relative(src_dir, reserveItem);
      const destPath = path.resolve(out_dir, relativePath);
      const emsPath = esm_dir && path.resolve(esm_dir, relativePath);
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
      await execShell(['npm test'], () => logEmph('单元测试通过！(unit test passed!)'), handleBuildErr('单元测试失败！(unit test failed!)'));
    }

    if (verify && eslint) {
      await execShell(['npm run lint:es'], () => logEmph('eslint校验通过！(eslint passed!)'), handleBuildErr(`eslint校验失败！(eslint checking failed!) \n ${chalk.bgGreen('尝试执行 (try to exec): npm run lint:es_fix')}`));
    }

    if (verify && stylelint) {
      await execShell(['npm run lint:style'], () => logEmph('stylelint校验通过！(stylelint passed!)'), handleBuildErr(`stylelint校验失败！(stylelint checking failed!) \n ${chalk.bgGreen('尝试执行 (try to exec): npm run lint:style_fix')}`));
    }

    if (!tool) {
      logWarn('构建完毕，但是没有指定任何构建工具参与构建！(Building completed but without any build tool process!)');
      return process.exit(0);
    }

    const buildCliArr = [];
    if (tool === 'tsc') {
      const tscPath = path.resolve(process.cwd(), 'node_modules/typescript/bin/tsc');
      buildCliArr.push(`${tscPath} --outDir ${out_dir} --project ${path.resolve(process.cwd(), 'tsconfig.json')}`);
      esm_dir && buildCliArr.push(`${tscPath} --module ES6 --target ES6 --outDir ${esm_dir} --project ${path.resolve(process.cwd(), 'tsconfig.json')}`);

      if (!fs.existsSync(tscPath)) {
        logWarn('请先安装 typescript! (Please install typescript first!)');
        const is_go_on = await installDenpendencies('tsc');
        if (!is_go_on) return;
      }
    } else {
      const content_rollup = tool === 'rollup' && rollupConfig({ ts: typescript, multi_output, src_dir, out_dir, esm_dir });
      const content_webpack = tool === 'webpack' && webpackConfig({ ts: typescript, multi_output, src_dir, out_dir });
      const content_config = content_rollup || content_webpack;
  
      // put temporary file for build process
      if (content_config) {
        const buildConfigPath = path.resolve(__dirname, '../../../', '.omni_cache/build.config.js');

        let is_go_on = true;
        if (tool === 'rollup') {
          const rollupPath = path.resolve(process.cwd(), 'node_modules/rollup/dist/bin/rollup');
          buildCliArr.push(`${rollupPath} -c ${buildConfigPath}`);

          if (!fs.existsSync(rollupPath)) {
            logWarn('请先安装 rollup! (Please install rollup first!)');
            is_go_on = await installDenpendencies('rollup');
          }
        } else if (tool === 'webpack') {
          const webpackPath = path.resolve(process.cwd(), 'node_modules/webpack-cli/bin/cli.js');
          buildCliArr.push(`${webpackPath} --config ${buildConfigPath}`);

          if (!fs.existsSync(webpackPath)) {
            logWarn('请先安装 webpack-cl! (Please install webpack-cli first!)');
            is_go_on = await installDenpendencies('webpack');
          }
        }

        if (!is_go_on) {
          return process.exit(1);
        }

        fsExtra.outputFileSync(buildConfigPath, content_config, 'utf8');
      } else {
        logWarn(`你的构建工具 ${tool} 暂不支持，请自行构建你的项目，或联系我们：omni.door.official@gmail.com \n your build tool ${tool} has not been support yet, please build the project by yourself! \n contact us: omni.door.official@gmail.com`);
        return process.exit(1);
      }
    }

    const spinner = tool !== 'rollup' && ora(`${getBrand()} 项目构建中 (Building, please wait patiently)  ⏱  \n`);
    spinner && spinner.start();

    del.sync(out_dir);
    esm_dir && del.sync(esm_dir);

    await execShell(buildCliArr, async function () {
      const { style, assets = [] } = reserve;
      style && copyStylesheet(src_dir);
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
      handleBuildSuc()();
    }, function () {
      spinner && spinner.stop();
      handleBuildErr()();
    });

    if (auto_release) {
      logInfo('开始自动发布！(beginning auto release!)');
      await execShell(['omni release --no-verify'], handleBuildSuc('自动发布成功！(auto release success!)'), handleBuildErr('自动发布失败！(auto release failed!)'));
    }
  } catch (err) {
    logErr(`糟糕！构建过程发生了点意外！(Oops! build process occured some accidents!) \n👉  ${JSON.stringify(err)}`);
  }
}