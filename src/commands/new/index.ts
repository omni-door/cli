import fs from 'fs';
import path from 'path';
import fsExtra from 'fs-extra';
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
} from '../../templates';
import { OmniConfig } from '../../index.d';

/**
 * todo 1. support custom tpl
 */
export default function (config: OmniConfig | {}, componentName: string, options?: {
  fc?: boolean;
  cc?: boolean;
}) {
  if (JSON.stringify(config) === '{}') {
    logWarn('Please Initialize project first');
    return;
  }

  // capitalize first character
  componentName = componentName!.charAt(0).toUpperCase() + componentName!.slice(1);

  let { fc, cc } = options!;

  // default create class component
  if (!fc && !cc) cc = true;

  const message = `Start create ${cc ? 'class' : 'functional'} component - ${componentName} 🕐`;
  logInfo(message);

  const { template: {
    root,
    test = '',
    typescript = false,
    stylesheet = '',
    readme = false,
    mdx = false
  } } = config as OmniConfig;
  
  try {
    const content_index = indexTpl({ ts: typescript, componentName });
    const content_cc = class_component({ ts: typescript, componentName, style: stylesheet });
    const content_fc = functional_component({ ts: typescript, componentName, style: stylesheet });
    const content_readme = readmeTpl({ componentName });
    const content_mdx = mdxTpl({ componentName });
    const content_stories = storiesTpl({ componentName });
    const content_style = styleTpl({ componentName });
    const content_test = testTpl({ testFrame: test, componentName });
  
    fsExtra.outputFileSync(path.resolve(root, componentName, `index.${typescript ? 'ts' : 'js'}`), content_index, 'utf8');
    cc && fsExtra.outputFileSync(path.resolve(root, componentName, `${componentName}.${typescript ? 'tsx' : 'jsx'}`), content_cc, 'utf8');
    fc && fsExtra.outputFileSync(path.resolve(root, componentName, `${componentName}.${typescript ? 'tsx' : 'jsx'}`), content_fc, 'utf8');
    readme && !mdx && fsExtra.outputFileSync(path.resolve(root, componentName, 'README.md'), content_readme, 'utf8');
    readme && mdx && fsExtra.outputFileSync(path.resolve(root, componentName, 'README.mdx'), content_mdx, 'utf8');
    fs.existsSync(path.resolve(process.cwd(), '.storybook')) && fsExtra.outputFileSync(path.resolve(root, componentName, `__stories__/index.stories.${
      typescript
        ? 'tsx'
        : 'jsx'
    }`), content_stories, 'utf8');
    content_style && fsExtra.outputFileSync(path.resolve(root, componentName, `style/${componentName}.${stylesheet}`), content_style, 'utf8');
    test && fsExtra.outputFileSync(path.resolve(root, componentName, `__test__/index.test.${
      typescript
        ? test === 'jest'
          ? 'tsx' : 'ts'
        : test === 'jest'
          ? 'jsx' : 'js'
    }`), content_test, 'utf8');

    // success logger
    logSuc(`The ${componentName} component construction completed!`);
  } catch (err) {
    // error logger
    logErr(`Oops! Some error occured 👉  ${JSON.stringify(err)}`);
  }
}