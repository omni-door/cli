import run from './run';
import { logWarn, nodeVersionCheck } from '@omni-door/utils';
import { signal } from '../../utils';
/* import types */
import type { OmniConfig } from '../../index.d';

function handleException (msg?: string) {
  logWarn(msg || 'Oops! Some unknown errors have occurred(发生了一些未知错误)!');
  process.exit(0);
}

export default async function (config: OmniConfig | null, options: {
  port?: number | string;
  hostname?: string;
}) {
  try {
    // node version pre-check
    await nodeVersionCheck('8');
  } catch (e) {
    logWarn(e as string);
  }

  if (!config || JSON.stringify(config) === '{}') {
    handleException('Please initialize project first(请先初始化项目)!');
  }

  const p = options.port;
  const h = options.hostname;
  const { type, dev, server } = config!;

  if (!dev || JSON.stringify(dev) === '{}') {
    handleException('The dev field is missing in config file(配置文件 dev 字段缺失)!');
  }

  const { serverType: server_type, ...serverOptions } = server || {};
  const {
    port,
    host,
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
    handleException(`The ${type}-app missing the dev-server webpack-config(${type}应用 缺少开发服务webpack配置文件)!`); 
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
    devMiddlewareOptions, 
    proxyConfig: proxy,
    middlewareConfig: middleware,
    serverType,
    projectType: type
  });
}