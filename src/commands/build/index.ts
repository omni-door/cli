import path from 'path';
import fsExtra from 'fs-extra';
import rollupConfig from './rollup';
import webpackConfig from './webpack';
import { logErr, logInfo, logWarn, logSuc, logEmph } from '../../utils/logger';
import { execShell } from '../../utils/exec';
import { OmniConfig } from '../../index.d';

/**
 * todo 1. gulp
 */
export default async function (config: OmniConfig | {}) {
  if (JSON.stringify(config) === '{}') {
    logWarn('Please Initialize project first');
    return;
  }

  const message = '⏱  Build process start!';
  logInfo(message);

  const { build: {
    tool,
    configuration,
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

  function buildSuc () {
    logSuc('📣  Building completed!');
  }

  function buildErr (err: any) {
    logErr(`Building failed! 👉  ${JSON.stringify(err)}`);
  }

  try {
    if (test) {
      await execShell(['npm test'], () => logEmph('🔈  unit test passed!'), err => logWarn(`unit test failed! 👉  ${JSON.stringify(err)}`));
    }

    if (eslint) {
      await execShell(['npm run lint:es'], () => logEmph('🔈  eslint passed!'), err => logWarn(`eslint checking failed! 👉  ${JSON.stringify(err)}`));
    }

    if (stylelint) {
      await execShell(['npm run lint:style'], () => logEmph('🔈  stylelint passed!'), err => logWarn(`stylelint checking failed! 👉  ${JSON.stringify(err)}`));
    }

    if (!tool) {
      logSuc('Building completed but without any build tool process!');
    }

    const buildCliArr = [];
    if (tool === 'tsc') {
      const tscPath = path.resolve(process.cwd(), 'node_modules/typescript/bin/tsc');
      buildCliArr.push(`${tscPath} --outDir ${out_dir} --project ${path.resolve(process.cwd(), 'tsconfig.json')}`);
      esm_dir && buildCliArr.push(`${tscPath} --module ES6 --target ES6 --outDir ${esm_dir} --project ${path.resolve(process.cwd(), 'tsconfig.json')}`);
    } else {
      const content_rollup = tool === 'rollup' && rollupConfig({ ts: typescript, multi_output, src_dir, out_dir, esm_dir });
      const content_webpack = tool === 'webpack' && webpackConfig({ ts: typescript, multi_output, src_dir, out_dir });
      const content_config = content_rollup || content_webpack;
  
      // put temporary file for build process
      if (content_config) {
        const buildConfigPath = path.resolve(__dirname, '../../../', '.omni_cache/build.config.js');
        fsExtra.outputFileSync(buildConfigPath, content_config, 'utf8');
  
        let configs = require(buildConfigPath);
        if (tool === 'rollup') {
          configs = await configs;
        }
        // if (typeof configuration === 'function') {
        //   configuration(configs);
        // }
  
        const webpackPath = path.resolve(process.cwd(), 'node_modules/webpack-cli/bin/cli.js');
        const rollupPath = path.resolve(process.cwd(), 'node_modules/rollup/dist/bin/rollup');

        if (tool === 'rollup') {
          buildCliArr.push(`${rollupPath} -c ${buildConfigPath}`);
        } else if (tool === 'webpack') {
          buildCliArr.push(`${webpackPath} --config ${buildConfigPath}`);
        }
      }
    }

    await execShell(buildCliArr, buildSuc, buildErr);

    if (auto_release) {
      await execShell(['omni release'], () => logEmph('release success!'), err => logWarn(`release failed! 👉  ${JSON.stringify(err)}`));
    }
  } catch (err) {
    logErr(`Oops! build process occured some accidents 👉  ${JSON.stringify(err)}`);
  }
}