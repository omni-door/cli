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

function handleException (msg?: string) {
  logWarn(msg || '发生了一些未知错误！(Ops! Some unknown errors have occurred!)');
  process.exit(0);
}

export default async function (config: OmniConfig, componentName: string, options?: {
  function?: boolean;
  class?: boolean;
  tplPkj?: string;
  before?: (params: {
    root: string;
    componentName: string;
  }) => (void | Promise<any>);
  after?: (params: {
    root: string;
    componentName: string;
  }) => (void | Promise<any>);
}) {
  try {
    // node version pre-check
    await node_version('8');
  } catch (err) {
    logWarn(err);
  }

  if (!config || JSON.stringify(config) === '{}') {
    handleException('请先初始化项目！(Please initialize an omni-project first!)');
  }

  if (!componentName) {
    handleException('请输入创建的模块名称！(Please input the module name!)');
  }

  if (!/[a-zA-Z\$\_]/.test(componentName.charAt(0))) {
    handleException('请输入合法的模块名称！(Please input a valid module name!)');
  }

  // capitalize first character
  componentName = componentName.charAt(0).toUpperCase() + componentName.slice(1);

  let { function: fc, class: cc, tplPkj, before, after } = options || {};

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
    handleException('生成模板的路径缺失！(Missing the path for generate template!)');
  }

  const mdx = readme[1] === 'mdx';
  const path_cp = path.resolve(root, componentName);
  const path_cp_rel = path.relative(process.cwd(), path_cp);

  if (fs.existsSync(path_cp)) {
    handleException(`模块 ${componentName} 已存在！(The ${componentName} module had been existed!)`);
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

  typeof before === 'function' && await before({
    componentName,
    root
  });

  logInfo(`正在下载 ${newTplPkj} 模板，请稍后... (Downloading the templates, please wait patiently…)`);
  exec(
    [
      `npx ${newTplPkj}@latest new ${arr2str(params)}`
    ],
    async function () {
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
      typeof after === 'function' && await after({
        componentName,
        root
      });
      // success logger
      logSuc(`${componentName} 位于 ${path_cp_rel}，创建完成！(The ${componentName} local at ${path_cp_rel}, construction completed!)`);
      process.exit(0);
    },
    function (err: any) {
      logErr(`完蛋！好像有错误！(Oops! Some error occured) \n👉  ${JSON.stringify(err)}`);
      process.exit(1);
    });
}