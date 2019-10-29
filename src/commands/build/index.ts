import path from 'path';
import fsExtra from 'fs-extra';
import rollupConfig from './rollup';
import webpackConfig from './webpack';
import { logErr, logInfo, logWarn, logSuc, logEmph } from '../../utils/logger';
import { execShell } from '../../utils/exec';
import { OmniConfig } from '../../index.d';

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
    logErr(`Building failed because that ${JSON.stringify(err)} occured!`);
  }

  try {
    if (test) {
      await execShell(['npm test'], () => logEmph('unit test passed!'), err => logWarn(`unit test because that ${JSON.stringify(err)} occured!`));
    }

    if (eslint) {
      await execShell(['npm run lint:es'], () => logEmph('eslint passed!'), err => logWarn(`eslint failed because that ${JSON.stringify(err)} occured!`));
    }

    if (stylelint) {
      await execShell(['npm run lint:style'], () => logEmph('stylelint passed!'), err => logWarn(`stylelint failed because that ${JSON.stringify(err)} occured!`));
    }

    const content_rollup = tool === 'rollup' && rollupConfig({ ts: typescript, multi_output, src_dir, out_dir, esm_dir });
    const content_webpack = tool === 'webpack' && webpackConfig({ ts: typescript, multi_output, src_dir, out_dir });
    const content_config = content_rollup || content_webpack;

    // put temporary file for build process
    if (content_config) {
      const buildConfigPath = path.resolve(process.cwd(), '.omni_cache/build.config.js');
      fsExtra.outputFileSync(buildConfigPath, content_config, 'utf8');
      let configs = require(buildConfigPath);
      if (tool === 'rollup') {
        configs = await configs;
      }
      configs = configuration ? configuration(configs) : configs;

      const content_rollup_custom = tool === 'rollup' && rollupConfig({ ts: typescript, multi_output, src_dir, out_dir, esm_dir, custom_exports: configs });
      const content_webpack_custom = tool === 'webpack' && webpackConfig({ ts: typescript, multi_output, src_dir, out_dir, custom_exports: configs });
      const content_config_custom = content_rollup_custom || content_webpack_custom;
      fsExtra.outputFileSync(buildConfigPath, content_config_custom, 'utf8');

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
      await execShell(['omni release'], () => logEmph('release success!'), err => logWarn(`release failed because that ${JSON.stringify(err)} occured!`));
    }
  } catch (err) {
    logErr(`Oops! some accident occured ${JSON.stringify(err)}`);
  }
}