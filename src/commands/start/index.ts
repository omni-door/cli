import path from 'path';
import { logWarn, nodeVersionCheck, requireCwd, exec, _typeof } from '@omni-door/utils';
import { KNServer } from '../servers';
import { signal } from '../../utils';
/* import types */
import type { OmniConfig } from '../../index.d';

function handleException (msg?: string) {
  logWarn(msg || 'Oops! Some unknown errors have occurred!');
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
    handleException('Please initialize project first!');
  }
  const { server } = config!;

  if (!server || JSON.stringify(server) === '{}') {
    handleException('The start field is missing in the config file!');
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
    handleException('Please specify server-type!');
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
    logWarn(`HTTPS requires key/cert paths when starting the server in production: \n

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
  }
}
