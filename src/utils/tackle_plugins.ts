import { logWarn, PLUGINSTAGE } from '@omni-door/tpl-utils';
import { HandlerFactory, PluginHandler, OmniPlugin } from '../index.d';

export function getHandlers (plugins: OmniPlugin[], stage: PLUGINSTAGE) {
  const handlers: { [pluginName: string]: PluginHandler } = {};
  for (let i = 0; i < plugins.length; i++) {
    const plugin = plugins[i];
    plugin.stage === stage && (handlers[plugin.name] = handlerFactory(plugin.handler, `插件 [${plugin.name}] 执行发生错误，将跳过继续执行剩余操作！(The plugin execution error, will skip to continue the rest of the operaions!)`));
  }

  return handlers;
}

export const handlerFactory: HandlerFactory = (handler, errMsg) => (config) => {
  try {
    return handler(config);
  } catch (err) {
    logWarn(JSON.stringify(err));
    logWarn(errMsg || '插件执行发生错误，将跳过继续执行剩余操作！(The plugin execution error, will skip to continue the rest of the operaions!)');    
  }
  return Promise.resolve({});
};