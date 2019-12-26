import { PluginStage, OmniPlugin } from '../index.d';

export function getHandlers (plugins: OmniPlugin[], stage: PluginStage) {
  const handlers = [];
  for (let i = 0; i < plugins.length; i++) {
    const plugin = plugins[i];
    plugin.stage === stage && handlers.push(plugin.handler);
  }

  return handlers;
}