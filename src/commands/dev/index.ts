import { logWarn } from '../../utils/logger';
import server from './server';
import { OmniConfig } from '../../index.d';

export default async function (config: OmniConfig | {}, p: number | string = 6200) {
  if (JSON.stringify(config) === '{}') {
    logWarn('请先初始化项目！(Please initialize project first!)');
    return process.exit(0);
  }

  const {
    type,
    dev: {
      port = 6200,
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

    const _port = !isNaN(+p)
      ? +p
      : !isNaN(+port)
        ? +port
        : 6200;

    server({
      p: _port,
      webpackConfig: webpack_config,
      proxyConfig: proxy
    });
  }
}