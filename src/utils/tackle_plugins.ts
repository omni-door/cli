import { logWarn } from '@omni-door/utils';
/* import types */
import type { PLUGINSTAGE } from '@omni-door/utils';
import type { HandlerFactory, PluginHandler, OmniPlugin } from '../index.d';

export function getHandlers<T extends PLUGINSTAGE> (plugins: OmniPlugin<T>[], stage: T) {
  const handlers: { [pluginName: string]: PluginHandler<T> } = {};
  for (let i = 0; i < plugins.length; i++) {
    const plugin = plugins[i];
    plugin.stage === stage && (handlers[plugin.name] = handlerFactory<T>(plugin.handler, `The "${plugin.name}" execution error, will skip to continue the rest of the operaions(插件 "${plugin.name}" 执行发生错误，将跳过继续执行剩余操作)`));
  }

  return handlers;
}

export const handlerFactory: HandlerFactory = (handler, errMsg) => (config, options) => {
  try {
    return handler(config, options);
  } catch (err) {
    logWarn(err);
    logWarn(errMsg || 'The plugin execution error, will skip to continue the rest of the operaions(插件执行发生错误，将跳过继续执行剩余操作)');
  }
  return Promise.resolve({});
};