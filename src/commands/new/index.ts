import fs from 'fs';
import path from 'path';
import {
  exec,
  arr2str,
  logErr,
  logInfo,
  logWarn,
  logSuc,
  node_version
} from '@omni-door/tpl-utils';
import { OmniConfig, OmniPlugin } from '../../index.d';
import { getHandlers } from '../../utils/tackle_plugins';

export default async function (config: OmniConfig, componentName: string, options?: {
  function?: boolean;
  class?: boolean;
  tplPkj?: string;
}) {
  try {
    // node version pre-check
    await node_version('8');
  } catch (err) {
    logWarn(err);
  }

  if (!config || JSON.stringify(config) === '{}') {
    logWarn('请先初始化项目！(Please initialize an omni-project first!)');
    return process.exit(0);
  }

  if (!componentName) {
    logWarn('请输入创建的模块名称！(Please input the module name!)');
    return process.exit(0);
  }

  if (!/[a-zA-Z\$\_]/.test(componentName.charAt(0))) {
    logWarn('请输入合法的模块名称！(Please input a valid module name!)');
    return process.exit(0);
  }

  // capitalize first character
  componentName = componentName.charAt(0).toUpperCase() + componentName.slice(1);

  let { function: fc, class: cc, tplPkj } = options!;

  // default create class component
  if (!fc && !cc) cc = true;

  const {
    type = 'spa-react',
    template,
    build,
    release,
    plugins
  } = config;
  const {
    root,
    test,
    typescript = false,
    stylesheet = '',
    readme = [false, 'md']
  } = template;

  if (!root) {
    logWarn('生成模板的路径缺失！(Missing the path for generate template!)');
    return process.exit(0);
  }

  const mdx = readme[1] === 'mdx';
  const path_cp = path.resolve(root, componentName);
  const path_cp_rel = path.relative(process.cwd(), path_cp);

  if (fs.existsSync(path_cp)) {
    logWarn(`模块 ${componentName} 已存在！(The ${componentName} module had been existed!)`);
    return process.exit(0);
  }

  const hasStorybook = fs.existsSync(path.resolve(process.cwd(), '.storybook'));
  const params = [
    `componentName=${componentName}`,
    `newPath=${path_cp}`,
    `stylesheet=${stylesheet}`,
    `ts=${typescript}`,
    `type=${fc ? 'fc' : 'cc'}`,
    `test=${!!test}`,
    `hasStorybook=${hasStorybook}`,
    readme[0] ? `md=${mdx ? 'mdx' : 'md'}` : ''
  ];

  async function handleSuc () {
    // handle new plugins
    const plugin_handles = plugins && plugins.length > 0 && getHandlers<'new'>(plugins as OmniPlugin<'new'>[], 'new');
    if (plugin_handles) {
      for (const name in plugin_handles) {
        const handler = plugin_handles[name];
        await handler({
          type,
          template,
          build,
          release
        }, {
          componentName,
          componentType: fc ? 'function' : 'class'
        });
      }
    }
    // success logger
    logSuc(`${componentName} 位于 ${path_cp_rel}，创建完成！(The ${componentName} local at ${path_cp_rel}, construction completed!)`);
    process.exit(0);
  }

  function handleErr (err: any) {
    // error logger
    logErr(`完蛋！好像有错误！(Oops! Some error occured) \n👉  ${JSON.stringify(err)}`);
    process.exit(1);
  }

  let newTplPkj = tplPkj;
  if (!newTplPkj) {
    switch (type) {
      case 'spa-react':
        newTplPkj = '@omni-door/tpl-spa-react';
        break;
      case 'component-library-react':
        newTplPkj = '@omni-door/tpl-component-library-react';
        break;
      case 'toolkit':
        newTplPkj = '@omni-door/tpl-toolkit';
        break;
    }
  }

  logInfo(`正在下载 ${newTplPkj} 模板，请稍后... (Downloading the templates, please wait patiently…)`);
  exec([
    `npx ${newTplPkj}@latest new ${arr2str(params)}`
  ], handleSuc, handleErr);
}