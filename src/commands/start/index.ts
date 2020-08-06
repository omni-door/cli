import path from 'path';
import { logWarn, node_version, require_cwd, exec } from '@omni-door/utils';
import { OmniConfig } from '../../index.d';
import { KNServer } from '../servers';

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
  const { start } = config as OmniConfig;

  if (!start || JSON.stringify(start) === '{}') {
    handleException('配置文件 start 字段缺失！(The start field is missing in config file!)');
  }
  const {
    port,
    host,
    serverType,
    ...rest
  } = start || {};
  if (!serverType) {
    handleException('请指定 server 类型！(Please specify server-type!)');
  }

  const p = options.port;
  const h = options.hostname;
  const ip = require_cwd('ip');
  const ipAddress: string = ip.address();
  const CWD = process.cwd();
  const _port = (p ? +p : port) || 6200;
  const _host = h || host || '0.0.0.0';

  const ServerStartCli = {
    next: `${path.resolve(CWD, 'node_modules/.bin/next')} start --port ${_port} --host ${_host}`
  };

  switch (serverType) {
    case 'koa-next':
      KNServer({
        dev: process.env.NODE_ENV === 'development',
        port: _port,
        host: _host,
        logLevel: 'error',
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
      logWarn('暂不支持 ssr-vue 项目!');
  }
}