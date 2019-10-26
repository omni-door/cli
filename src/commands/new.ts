import shelljs from 'shelljs';
import { logErr, logInfo } from '../utils/logger';
import { OmniConfig } from '../index.d';

export default function ({
  config,
  fc,
  cc
}: {
  fc?: boolean;
  cc?: boolean;
  config: OmniConfig | null;
}) {
  if (!config) {
    shelljs.exec('omni init');
    return;
  }

  logInfo(JSON.stringify(config));
}