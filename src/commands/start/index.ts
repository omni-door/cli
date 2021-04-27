import path from 'path';
import { logWarn, nodeVersionCheck, requireCwd, exec } from '@omni-door/utils';
import { KNServer } from '../servers';
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
    await nodeVersionCheck('8');
  } catch (e) {
    logWarn(e);
  }

  if (!config || JSON.stringify(config) === '{}') {
    handleException('Please initialize project first(请先初始化项目)!');
  }
  const { server } = config!;

  if (!server || JSON.stringify(server) === '{}') {
    handleException('The start field is missing in config file(配置文件 start 字段缺失)!');
  }
  const {
    port,
    host,
    serverType,
    ...rest
  } = server || {};
  if (!serverType) {
    handleException('Please specify server-type(请指定 server 类型)!');
  }

  const p = options.port;
  const h = options.hostname;
  const ip = requireCwd('ip');
  const ipAddress: string = ip.address();
  const CWD = process.cwd();
  const _port = (p ? +p : port) || 6200;
  const _host = h || host || '0.0.0.0';

  const ServerStartCli = {
    next: `${path.resolve(CWD, 'node_modules/.bin/next')} start --port ${_port} --hostname ${_host}`
  };

  switch (serverType) {
    case 'koa-next':
      KNServer({
        dev: process.env.NODE_ENV === 'development',
        port: _port,
        host: _host,
        ipAddress,
        ...rest
      });
      break;
    case 'next':
      exec([ServerStartCli[serverType]]);
      break;
    case 'koa-nuxt':
    case 'nuxt':
    default:
      logWarn('Not support ssr-vue yet');
      logWarn('暂不支持 ssr-vue 项目');
  }
}