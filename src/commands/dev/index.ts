import run from './run';
import { logWarn, node_version } from '@omni-door/utils';
import { signal } from '../../utils';
/* import types */
import type { OmniConfig } from '../../index.d';

function handleException (msg?: string) {
  logWarn(msg || '发生了一些未知错误！(Ops! Some unknown errors have occurred!)');
  process.exit(0);
}

export default async function (config: OmniConfig | null, options: {
  port?: number | string;
  hostname?: string;
}) {
  try {
    // node version pre-check
    await node_version('8');
  } catch (e) {
    logWarn(e);
  }

  if (!config || JSON.stringify(config) === '{}') {
    handleException('请先初始化项目！(Please initialize project first!)');
  }

  const p = options.port;
  const h = options.hostname;
  const { type, dev, server } = config!;

  if (!dev || JSON.stringify(dev) === '{}') {
    handleException('配置文件 dev 字段缺失！(The dev field is missing in config file!)');
  }

  const { serverType: server_type, ...serverOptions } = server || {};
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
  } = { ...serverOptions, ...dev };

  // bind exit signals
  signal();

  const EWServerList = [ 'spa-react', 'spa-vue' ];
  if (~EWServerList.indexOf(type) && !webpack) {
    handleException(`${type}应用 缺少开发服务webpack配置文件！(The ${type}-app missing the dev-server webpack-config!)`); 
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