import path from 'path';
import fsExtra from 'fs-extra';
import { logErr, logInfo, logWarn, logSuc } from '../utils/logger';
import indexTpl from '../templates/component/index';
import class_component from '../templates/component/class_component';
import functional_component from '../templates/component/functional_component';
import readmeTpl from '../templates/component/readme';
import styleTpl from '../templates/component/stylesheet';
import testTpl from '../templates/component/test';
import { OmniConfig } from '../index.d';

export default function (config: OmniConfig | {}, componentName?: string, options?: {
  fc?: boolean;
  cc?: boolean;
}) {
  if (!componentName) {
    logErr('Please input your component name!');
    return;
  }

  if (JSON.stringify(config) === '{}') {
    logWarn('Please Initialize project first');
    return;
  }

  // capitalize first character
  componentName = componentName!.charAt(0).toUpperCase() + componentName!.slice(1);

  let { fc, cc } = options!;

  // default create class component
  if (!fc && !cc) cc = true;

  const message = `🕐  Start create ${cc ? 'class' : 'functional'} component - ${componentName}`;
  logInfo(message);

  const { template: {
    root,
    test,
    typescript,
    stylesheet,
    readme
  } } = config as OmniConfig;
  
  const content_index = indexTpl({ ts: typescript, componentName });
  const content_cc = class_component({ ts: typescript, componentName, style: stylesheet });
  const content_fc = functional_component({ ts: typescript, componentName, style: stylesheet });
  const content_readme = readmeTpl({ componentName });
  const content_style = styleTpl({ componentName });
  const content_test = testTpl({ testFrame: test, componentName });

  fsExtra.outputFileSync(path.resolve(root, `index.${typescript ? 'ts' : 'js'}`), content_index, 'utf8');
  cc && fsExtra.outputFileSync(path.resolve(root, `${componentName}.${typescript ? 'tsx' : 'jsx'}`), content_cc, 'utf8');
  fc && fsExtra.outputFileSync(path.resolve(root, `${componentName}.${typescript ? 'tsx' : 'jsx'}`), content_fc, 'utf8');
  readme && fsExtra.outputFileSync(path.resolve(root, 'README.md'), content_readme, 'utf8');
  content_style && fsExtra.outputFileSync(path.resolve(root, `style/${componentName}.${stylesheet}`), content_style, 'utf8');
  test && fsExtra.outputFileSync(path.resolve(root, `__test__/index.test.${typescript ? 'ts' : 'js'}`), content_test, 'utf8');

  logSuc(`The ${componentName} component construction completed!`);
}