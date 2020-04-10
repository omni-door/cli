export default function () {
  (['SIGINT', 'SIGQUIT', 'SIGTERM'] as NodeJS.Signals[]).forEach((sig) => {
    process.on(sig, () => process.exit(0));
  });
}