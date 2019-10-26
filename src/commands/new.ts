import shelljs from 'shelljs';
import { logErr, logInfo, logWarn } from '../utils/logger';
import { OmniConfig } from '../index.d';

export default function (config: OmniConfig | {}, {
  fc,
  cc
}: {
  fc?: boolean;
  cc?: boolean;
}) {
  if (JSON.stringify(config) === '{}') {
    logWarn('Please Initialize project first');
    shelljs.exec('omni init');
    return;
  }

  logInfo(JSON.stringify(config));
}