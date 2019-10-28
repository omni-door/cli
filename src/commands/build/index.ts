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

  try {
    if (test) {
      await execShell(['npm test'], () => logEmph('unit test passed!'), err => logErr(`unit test because that ${JSON.stringify(err)}`));
    }

    if (eslint || stylelint) {
      await execShell(['npm run lint'], () => logEmph('lint passed!'), err => logErr(`lint failed because that ${JSON.stringify(err)}`));
    }

    const content_rollup = tool === 'rollup' && rollupConfig({ ts: typescript, multi_output, src_dir, out_dir, esm_dir });
    const content_webpack = tool === 'webpack' && webpackConfig({ ts: typescript, multi_output, src_dir, out_dir });
    const content_config = content_rollup || content_webpack;

    // put temporary file for build process
    if (content_config) {
      const cachePath = path.resolve('./.omni_cache/build.config.js');
      fsExtra.outputFileSync(cachePath, content_config, 'utf8');
      let configs = require(cachePath);
      if (tool === 'rollup') {
        configs = await configs;
      }
      configs = configuration ? configuration(configs) : configs;
      fsExtra.outputFileSync(cachePath, configs, 'utf8');

      const webpackPath = path.resolve(__dirname, '../../../node_modules', 'webpack-cli/bin/cli.js');
      const rollupPath = path.resolve(__dirname, '../../../node_modules', 'webpack-cli/dist/bin/rollup');
      const tscPath = path.resolve(__dirname, '../../../node_modules', 'typescript/bin/tsc');

      if (tool === 'rollup') {
        await execShell([
          `${rollupPath} -c ${cachePath}`
        ]);
      } else if (tool === 'webpack') {
        await execShell([
          `${webpackPath} --config ${cachePath}`
        ]);
      } else if (tool === 'tsc') {
        await execShell([
          `${tscPath} --build --outDir ${out_dir}`,
          esm_dir ? `${tscPath} --module ES6 --target ES6 --outDir ${esm_dir}` : ''
        ]);
      }
    }

    logSuc('Building completed!');

    if (auto_release) {
      await execShell(['omni release'], () => logEmph('release success!'), err => logErr(`release failed because that ${JSON.stringify(err)}`));
    }
  } catch (err) {
    logErr(`Oops! some error occured ${JSON.stringify(err)}`);
  }
}