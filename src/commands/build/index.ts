import path from 'path';
import fsExtra from 'fs-extra';
import rollupConfig from './rollup';
import webpackConfig from './webpack';
import { logErr, logInfo, logWarn, logSuc, logEmph } from '../../utils/logger';
import { execShell } from '../../utils/exec';
import { OmniConfig, ANYOBJECT } from '../../index.d';

export let custom_config: ANYOBJECT | null = null;
export default async function (config: OmniConfig | {}) {
  if (JSON.stringify(config) === '{}') {
    logWarn('Please Initialize project first');
    return;
  }

  const message = '🕜  Build process start!';
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
    logSuc('Building completed!');
  }

  function buildErr (err: any) {
    logErr(`Building failed! 👉  ${JSON.stringify(err)}`);
  }

  try {
    if (test) {
      await execShell(['npm test'], () => logEmph('unit test passed!'), err => logWarn(`unit test failed! 👉  ${JSON.stringify(err)}`));
    }

    if (eslint) {
      await execShell(['npm run lint:es'], () => logEmph('eslint passed!'), err => logWarn(`eslint checking failed! 👉  ${JSON.stringify(err)}`));
    }

    if (stylelint) {
      await execShell(['npm run lint:style'], () => logEmph('stylelint passed!'), err => logWarn(`stylelint checking failed! 👉  ${JSON.stringify(err)}`));
    }

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
      if (typeof configuration === 'function') {
        custom_config = configuration(configs);
      }

      const webpackPath = path.resolve(__dirname, '../../../node_modules', 'webpack-cli/bin/cli.js');
      const rollupPath = path.resolve(__dirname, '../../../node_modules', 'rollup/dist/bin/rollup');
      const tscPath = path.resolve(__dirname, '../../../node_modules', 'typescript/bin/tsc');

      const buildCliArr = [];
      if (tool === 'rollup') {
        buildCliArr.push(`${rollupPath} -c ${buildConfigPath}`);
      } else if (tool === 'webpack') {
        buildCliArr.push(`${webpackPath} --config ${buildConfigPath}`);
      } else if (tool === 'tsc') {
        buildCliArr.push(`${tscPath} --build ${path.resolve(process.cwd(), 'tsconfig.json')} --outDir ${out_dir}`);
        esm_dir && buildCliArr.push(`${tscPath} --build ${path.resolve(process.cwd(), 'tsconfig.json')} --module ES6 --target ES6 --outDir ${esm_dir}`);
      }

      await execShell(buildCliArr, buildSuc, buildErr);
    }

    if (auto_release) {
      await execShell(['omni release'], () => logEmph('release success!'), err => logWarn(`release failed! 👉  ${JSON.stringify(err)}`));
    }
  } catch (err) {
    logErr(`Oops! some accident occured 👉  ${JSON.stringify(err)}`);
  }
}