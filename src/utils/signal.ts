import { logInfo, logErr } from '@omni-door/utils';

export default function () {
  (['SIGINT', 'SIGQUIT', 'SIGTERM'] as NodeJS.Signals[]).forEach((sig) => {
    process.on(sig, () => {
      logInfo(`process exit by ${sig}`);
      process.exit(0);
    });
  });
  process.on('uncaughtException', e => {
    logErr(`uncaughtException - ${e.name}:${e.message}`);
  });
  process.on('unhandledRejection', reason => {
    logErr(`unhandledRejection - ${JSON.stringify(reason)}`);
  });
  process.on('exit', code => {
    logInfo(`exit with code ${code}`);
  });
}