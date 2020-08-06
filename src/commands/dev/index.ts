import run from './run';
import { logWarn, node_version } from '@omni-door/utils';
import { OmniConfig } from '../../index.d';
import { signal } from '../../utils';

function handleException (msg?: string) {
  logWarn(msg || '发生了一些未知错误！(Ops! Some unknown errors have occurred!)');
  process.exit(0);
}

export default async function (config: OmniConfig, options: {
  port?: number | string;
  hostname?: string;
}) {
  try {
    // node version pre-check
    await node_version('8');
  } catch (e) {
    logWarn(e);
  }

  if (JSON.stringify(config) === '{}') {
    handleException('请先初始化项目！(Please initialize project first!)');
  }

  const p = options.port;
  const h = options.hostname;
  const { type, dev } = config as OmniConfig;

  if (!dev || JSON.stringify(dev) === '{}') {
    handleException('配置文件 dev 字段缺失！(The dev field is missing in config file!)');
  }

  const {
    port,
    host,
    logLevel,
    devMiddlewareOptions,
    webpack,
    proxy,
    middleware,
    serverType = 'default',
    ...rest
  } = dev!;

  // bind exit signals
  signal();

  if (serverType === 'default' && !webpack) {
    handleException('缺少开发服务webpack配置文件！(Missing the dev-server webpack-config!)'); 
  }

  const _port = !isNaN(+p!)
    ? +p!
    : !isNaN(+port!)
      ? +port!
      : 6200;

  run({
    ...rest,
    p: _port,
    host: h || host,
    webpackConfig: webpack!,
    logLevel,
    devMiddlewareOptions, 
    proxyConfig: proxy,
    middlewareConfig: middleware,
    serverType,
    projectType: type
  });
}