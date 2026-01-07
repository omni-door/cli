import path from 'path';
import { logWarn, nodeVersionCheck, requireCwd, exec, _typeof } from '@omni-door/utils';
import { KNServer } from '../servers';
import { signal } from '../../utils';
/* import types */
import type { OmniConfig } from '../../index.d';

function handleException (msg?: string) {
  logWarn(msg || '发生了一些未知错误！(Oops! Some unknown errors have occurred!)');
  process.exit(0);
}

export default async function (config: OmniConfig | null, options: {
  port?: number | string;
  hostname?: string;
  passThroughArgs?: string[];
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
  const { server } = config!;

  if (!server || JSON.stringify(server) === '{}') {
    handleException('The start field is missing in config file(配置文件 start 字段缺失)!');
  }
  const {
    port,
    host,
    serverType,
    middleware,
    https,
    ...rest
  } = server || {};
  if (!serverType) {
    handleException('Please specify server-type(请指定 server 类型)!');
  }

  // bind exit signals
  signal();

  const p = options.port;
  const h = options.hostname;
  const ip = requireCwd('ip');
  const ipAddress: string = ip.address();
  const CWD = process.cwd();
  const _port = (p ? +p : port) || 6200;
  const _host = h || host || '0.0.0.0';

  if (_typeof(https) === 'boolean') {
    logWarn(`HTTPS requires key/cert paths when starting the server in production (开发环境中 https 必须指定路径): \n

    https: {
      key: fs.readFileSync(path.resolve(\${your_path_to_key})),
      cert: fs.readFileSync(path.resolve(\${your_path_to_cert}))
    }`);
  }

  const passThrough = options.passThroughArgs && options.passThroughArgs.length
    ? ` ${options.passThroughArgs.join(' ')}`
    : '';

  switch (serverType) {
    case 'next-app':
    case 'next-pages':
      exec([`${path.resolve(CWD, 'node_modules/.bin/next')} start --port ${_port} --hostname ${_host}${passThrough}`]);
      break;
    case 'nuxt':
    default:
      logWarn('ssr-vue is not supported yet');
      logWarn('暂不支持 ssr-vue 项目');
  }
}
