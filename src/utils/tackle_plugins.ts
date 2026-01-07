import { logWarn } from '@omni-door/utils';
/* import types */
import type { PLUGIN_STAGE } from '@omni-door/utils';
import type { HandlerFactory, PluginHandler, OmniPlugin } from '../index.d';

export function getHandlers<T extends PLUGIN_STAGE> (plugins: OmniPlugin<T>[], stage: T) {
  const handlers: { [pluginName: string]: PluginHandler<T> } = {};
  for (let i = 0; i < plugins.length; i++) {
    const plugin = plugins[i];
    plugin.stage === stage && (handlers[plugin.name] = handlerFactory<T>(plugin.handler, `The "${plugin.name}" execution failed; will skip the remaining operations(插件 "${plugin.name}" 执行发生错误，将跳过继续执行剩余操作)`));
  }

  return handlers;
}

export const handlerFactory: HandlerFactory = (handler, errMsg) => (config, options) => {
  try {
    return Promise.resolve(handler(config, options));
  } catch (err) {
    logWarn(err as any);
    logWarn(errMsg || 'The plugin execution failed; will skip the remaining operations(插件执行发生错误，将跳过继续执行剩余操作)');
  }
  return Promise.resolve({});
};
