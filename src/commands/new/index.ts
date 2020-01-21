import fs from 'fs';
import path from 'path';
import { logErr, logInfo, logWarn, logSuc } from '../../utils/logger';
import {
  component_class as class_component,
  component_functional as functional_component,
  component_index as indexTpl,
  component_readme as readmeTpl,
  component_stylesheet as styleTpl,
  component_test as testTpl,
  component_mdx as mdxTpl,
  component_stories as storiesTpl,
  tool_index,
  tool_readme,
  tool_test
} from '../../templates';
import { output_file } from '../../utils/output_file';
import { getHandlers } from '../../utils/tackle_plugins';
import node_version from '../../utils/node_version';
import { OmniConfig } from '../../index.d';

const default_tpl_list = {
  component_class: class_component,
  component_functional: functional_component,
  component_index: indexTpl,
  component_readme: readmeTpl,
  component_stylesheet: styleTpl,
  component_test: testTpl,
  component_mdx: mdxTpl,
  component_stories: storiesTpl,
  tool_index,
  tool_readme,
  tool_test
};

export default async function (config: OmniConfig | {}, componentName: string, options?: {
  fc?: boolean;
  cc?: boolean;
}) {
  try {
    // node version pre-check
    await node_version('8');
  } catch (err) {
    logWarn(err);
  }

  if (JSON.stringify(config) === '{}') {
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

  let { fc, cc } = options!;

  // default create class component
  if (!fc && !cc) cc = true;

  const {
    type = 'spa_react',
    template: {
      root,
      test = '',
      typescript = false,
      stylesheet = '',
      readme = [false, 'md']
    }, plugins } = config as OmniConfig;

  const mdx = readme[1] === 'mdx';

  if (!root) {
    logWarn('生成模板的路径缺失！(Missing the path for generate template!)');
    return process.exit(0);
  }

  if (fs.existsSync(path.resolve(root, componentName))) {
    logWarn(`模块 ${componentName} 已存在！(The ${componentName} module had been existed!)`);
    return process.exit(0);
  }

  // handle new plugins
  let custom_tpl_list = {};
  const plugin_handles = plugins && getHandlers(plugins, 'new');
  if (plugin_handles) {
    for (const name in plugin_handles) {
      const handler = plugin_handles[name];
      const res = await handler(config as OmniConfig, default_tpl_list);
      custom_tpl_list = { ...custom_tpl_list, ...res };
    }
  }

  const tpl = { ...default_tpl_list, ...custom_tpl_list };
  const isReactProject = type === 'spa_react' || type === 'component_library_react'; 

  const message = `开始创建 ${componentName} ${isReactProject ? `${cc ? '类' : '函数'}组件` : ''} (Start create ${componentName} ${isReactProject ? `${cc ? 'class' : 'functional'} component` : ''})`;
  logInfo(message);

  try {
    // component tpl
    const content_index = tpl.component_index({ ts: typescript, componentName });
    const content_cc = tpl.component_class({ ts: typescript, componentName, style: stylesheet });
    const content_fc = tpl.component_functional({ ts: typescript, componentName, style: stylesheet });
    const content_readme = tpl.component_readme({ componentName });
    const content_mdx = tpl.component_mdx({ componentName });
    const content_stories = tpl.component_stories({ componentName });
    const content_style = stylesheet && tpl.component_stylesheet({ componentName });
    const content_test = tpl.component_test({ componentName });
  
    // tool tpl
    const content_index_tool = tpl.tool_index({ toolName: componentName });
    const content_readme_tool = tpl.tool_readme({ toolName: componentName });
    const content_test_tool = tpl.tool_test({ toolName: componentName }); 

    if (isReactProject) {
      output_file({
        file_path: path.resolve(root, componentName, `index.${typescript ? 'ts' : 'js'}`),
        file_content: content_index
      });
      // class component
      cc && output_file({
        file_path: path.resolve(root, componentName, `${componentName}.${typescript ? 'tsx' : 'jsx'}`),
        file_content: content_cc
      });
      // functional component
      fc && output_file({
        file_path: path.resolve(root, componentName, `${componentName}.${typescript ? 'tsx' : 'jsx'}`),
        file_content: content_fc
      });
      // readme
      readme[0] && !mdx && output_file({
        file_path: path.resolve(root, componentName, 'README.md'),
        file_content: content_readme
      });
      readme[0] && mdx && output_file({
        file_path: path.resolve(root, componentName, 'README.mdx'),
        file_content: content_mdx
      });

      // storybook demo
      const hasStorybook = fs.existsSync(path.resolve(process.cwd(), '.storybook'));
      hasStorybook && output_file({
        file_path: path.resolve(root, componentName, `__stories__/index.stories.${
          typescript
            ? 'tsx'
            : 'jsx'
        }`),
        file_content: content_stories
      });

      // stylesheet
      output_file({
        file_path: path.resolve(root, componentName, `style/${componentName}.${stylesheet}`),
        file_content: content_style
      });
      // test file
      test && output_file({
        file_path: path.resolve(root, componentName, `__test__/index.test.${
          typescript
            ? test === 'jest'
              ? 'tsx' : 'ts'
            : test === 'jest'
              ? 'jsx' : 'js'
        }`),
        file_content: content_test
      });
    } else {
      // index file
      output_file({
        file_path: path.resolve(root, componentName, `index.${typescript ? 'ts' : 'js'}`),
        file_content: content_index_tool
      });
      // readme
      readme[0] && output_file({
        file_path: path.resolve(root, componentName, 'README.md'),
        file_content: content_readme_tool
      });
      // test file
      test && output_file({
        file_path: path.resolve(root, componentName, `__test__/index.test.${
          typescript
            ? 'ts'
            : 'js'
        }`),
        file_content: content_test_tool
      });
    }

    // success logger
    logSuc(`${componentName} 创建完成！(The ${componentName} construction completed!)`);
  } catch (err) {
    // error logger
    logErr(`完蛋！好像有错误！(Oops! Some error occured) \n👉  ${JSON.stringify(err)}`);
    process.exit(1);
  }
}