import { logErr, logInfo } from '../utils/logger';
import { OmniConfig } from '../index.d';

export default function ({
  config,
  fc,
  cc
}: {
  fc?: boolean;
  cc?: boolean;
  config: OmniConfig;
}) {
  logInfo(JSON.stringify(config));
}