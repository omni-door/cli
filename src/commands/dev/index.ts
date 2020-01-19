import run from './run';
import { logWarn } from '../../utils/logger';
import { OmniConfig } from '../../index.d';

export default function (config: OmniConfig | {}, options: { port?: number | string }) {
  if (JSON.stringify(config) === '{}') {
    logWarn('请先初始化项目！(Please initialize project first!)');
    return process.exit(0);
  }

  const p = options.port;
  const {
    type,
    dev: {
      port,
      webpack_config,
      proxy
    }
  } = config as OmniConfig;
  
  if (type === 'component_library_react') {
    logWarn('请直接执行 [npm start] 启动开发服务！(Please exec [npm start] to run dev-server!)');
    return process.exit(0);
  } else {
    if (!webpack_config) {
      logWarn('缺少开发服务webpack配置文件！(Missing the dev-server webpack-config!)');
      return process.exit(1);
    }

    const _port = !isNaN(+p!)
      ? +p!
      : !isNaN(+port!)
        ? +port!
        : 6200;

    run({
      p: _port,
      webpackConfig: webpack_config,
      proxyConfig: proxy
    });
  }
}