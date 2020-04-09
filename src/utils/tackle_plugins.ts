import { logWarn, PLUGINSTAGE } from '@omni-door/utils';
import { HandlerFactory, PluginHandler, OmniPlugin } from '../index.d';

export function getHandlers<T extends PLUGINSTAGE> (plugins: OmniPlugin<T>[], stage: T) {
  const handlers: { [pluginName: string]: PluginHandler<T> } = {};
  for (let i = 0; i < plugins.length; i++) {
    const plugin = plugins[i];
    plugin.stage === stage && (handlers[plugin.name] = handlerFactory<T>(plugin.handler, `插件 [${plugin.name}] 执行发生错误，将跳过继续执行剩余操作！(The [${plugin.name}] execution error, will skip to continue the rest of the operaions!)`));
  }

  return handlers;
}

export const handlerFactory: HandlerFactory = (handler, errMsg) => (config, options) => {
  try {
    return handler(config, options);
  } catch (err) {
    logWarn(err);
    logWarn(errMsg || '插件执行发生错误，将跳过继续执行剩余操作！(The plugin execution error, will skip to continue the rest of the operaions!)');    
  }
  return Promise.resolve({});
};