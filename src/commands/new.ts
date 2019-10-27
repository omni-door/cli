import shelljs from 'shelljs';
import { logErr, logInfo, logWarn } from '../utils/logger';
import { OmniConfig } from '../index.d';

export default function (config: OmniConfig | {}, params?: {
  fc?: boolean;
  cc?: boolean;
}) {
  if (!params) {
    logErr('Please input your component name!');
    return;
  }

  if (JSON.stringify(config) === '{}') {
    logWarn('Please Initialize project first');
    return;
  }

  const { fc, cc } = params!;

  logInfo(JSON.stringify(config));
}