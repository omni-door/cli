import fs from 'fs';
import path from 'path';
import fsExtra from 'fs-extra';
import shelljs from 'shelljs';
import inquirer from 'inquirer';
import rollupConfig from './rollup';
import webpackConfig from './webpack';
import { logErr, logInfo, logWarn, logSuc, logEmph } from '../../utils/logger';
import { execShell } from '../../utils/exec';
import { OmniConfig, BUILD } from '../../index.d';
import dependencies_build from '../../configs/dependencies_build';

/**
 * todo 1. gulp grunt 打包支持
 */
export default async function (config: OmniConfig | {}) {
  if (JSON.stringify(config) === '{}') {
    logWarn('Please Initialize project first');
    return;
  }

  const message = 'Build process start! ⏱';
  logInfo(message);

  const { build: {
    tool,
    multi_output,
    typescript,
    test,
    eslint,
    stylelint,
    src_dir,
    out_dir,
    esm_dir,
    auto_release
  } } = config as OmniConfig;

  function handleBuildSuc (msg?: string) {
    msg = msg || 'Building completed!';

    return function () {
      logSuc(`${msg} 📣`);
    };
  }

  function handleBuildErr (msg?: string) {
    msg = msg || 'Building failed!';

    return function (err: any) {
      logErr(`${msg} 👉  ${JSON.stringify(err)}`);
      process.exit(1);
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
        if (iToolCheck.stderr.indexOf('command not found')) {
          iTool = 'cnpm i --save-dev';
          iToolCheck = shelljs.exec('cnpm -v', { async: false });
          if (iToolCheck.stderr.indexOf('command not found')) {
            iTool = 'npm i --save-dev';
          }
        }

        return execShell([
          `${iTool} ${dependencies}`
        ],
        () => {
          logEmph('dependencies install completed!');
          return true;
        },
        err => {
          logWarn(`dependencies install occured some accidents 👉  ${JSON.stringify(err)}`);
          return false;
        });
      } else {
        return false;
      }
    });
  }

  try {
    if (test) {
      await execShell(['npm test'], () => logEmph('unit test passed! 🚩'), handleBuildErr('unit test failed!'), true);
    }

    if (eslint) {
      await execShell(['npm run lint:es'], () => logEmph('eslint passed! 🚩'), handleBuildErr('eslint checking failed!'), true);
    }

    if (stylelint) {
      await execShell(['npm run lint:style'], () => logEmph('stylelint passed! 🚩'), handleBuildErr('stylelint checking failed!'), true);
    }

    if (!tool) {
      logSuc('Building completed but without any build tool process!');
      process.exit(0);
      return;
    }

    const buildCliArr = [];
    if (tool === 'tsc') {
      const tscPath = path.resolve(process.cwd(), 'node_modules/typescript/bin/tsc');
      buildCliArr.push(`${tscPath} --outDir ${out_dir} --project ${path.resolve(process.cwd(), 'tsconfig.json')}`);
      esm_dir && buildCliArr.push(`${tscPath} --module ES6 --target ES6 --outDir ${esm_dir} --project ${path.resolve(process.cwd(), 'tsconfig.json')}`);

      if (!fs.existsSync(tscPath)) {
        logWarn('Please install typescript first!');
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
            logWarn('Please install rollup first!');
            is_go_on = await installDenpendencies('rollup');
          }
        } else if (tool === 'webpack') {
          const webpackPath = path.resolve(process.cwd(), 'node_modules/webpack-cli/bin/cli.js');
          buildCliArr.push(`${webpackPath} --config ${buildConfigPath}`);

          if (!fs.existsSync(webpackPath)) {
            logWarn('Please install webpack-cli first!');
            is_go_on = await installDenpendencies('webpack');
          }
        }

        if (!is_go_on) {
          process.exit(0);
          return;
        }

        fsExtra.outputFileSync(buildConfigPath, content_config, 'utf8');
      } else {
        logWarn(`your build tool ${tool} has not been support yet, please build the project by yourself! \n contact us: omni.door.official@gmail.com`);
      }
    }

    await execShell(buildCliArr, handleBuildSuc(), handleBuildErr());

    if (auto_release) {
      await execShell(['omni release'], () => logEmph('auto release success! 📣'), handleBuildErr('release failed!'));
    }
  } catch (err) {
    handleBuildErr('Oops! build process occured some accidents!')(err);
  }
}