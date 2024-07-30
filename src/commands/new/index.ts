import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import {
  exec,
  arr2str,
  logErr,
  logInfo,
  logWarn,
  logSuc,
  getNpmVersions,
  nodeVersionCheck
} from '@omni-door/utils';
import { getHandlers, signal, logo } from '../../utils';
/* import types */
import type { OmniConfig, OmniPlugin } from '../../index.d';

function handleException (msg?: string) {
  logWarn(msg || 'Oops! Some unknown errors have occurred(发生了一些未知错误)!');
  process.exit(0);
}

export default async function (config: OmniConfig | null, componentName: string, options?: {
  function?: boolean;
  class?: boolean;
  render?: boolean;
  single?: boolean;
  tplPkj?: string;
  tplPkjTag?: string;
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
    await nodeVersionCheck('8');
  } catch (e) {
    logWarn(e as string);
  }

  if (!config || JSON.stringify(config) === '{}') {
    handleException('Please initialize first(请先初始化项目)!');
  }

  const {
    type,
    template,
    build,
    release,
    plugins
  } = config!;

  if (!type) {
    handleException('Cannot find the project type(项目类型缺失)!');
  }

  const {
    root,
    test,
    typescript = false,
    stylesheet = '',
    readme = false
  } = template!;

  let module_cn = '组件';
  let module_en = 'component';
  if (type === 'toolkit') {
    module_cn = '模块';
    module_en = 'module';
  }

  // eslint-disable-next-line prefer-const
  let { function: fc, class: cc, render: h, single: sfc, tplPkj, tplPkjTag, before, after } = options || {};

  if (!root) {
    handleException(`Missing the path for generate ${module_en}(生成${module_cn}的路径缺失)!`);
  }

  if (!componentName || (!fc && !cc && !h && !sfc)) {
    const moduleType = {
      fc: 'Function-Component(函数组件)',
      cc: 'Class-Component(类组件)',
      h: 'Render-Function(渲染函数组件)',
      sfc: 'Single-File-Component(模板组件)',
    };
    const questions = [
      {
        name: 'name',
        type: 'input',
        when: (answer: any) => {
          if (componentName) {
            return false;
          }
          return true;
        },
        message: `${logo()} Please enter ${module_en} name(请输入${module_cn}名称):`
      },
      {
        name: 'type',
        type: 'list',
        when: (answer: any) => {
          if (!answer.name && !componentName) {
            handleException(`Please input the ${module_en} name(请输入创建的${module_cn}名称)!`);
          }
          if (type === 'spa-vue' || type === 'toolkit' || fc || cc) {
            return false;
          }
          return true;
        },
        choices: type === 'component-vue' ? [ moduleType.h, moduleType.sfc ] : [ moduleType.fc, moduleType.cc ],
        message: `${logo()} Select the type of ${module_en}(选择${module_cn}类型):`
      }      
    ];
    await new Promise((resolve) => {
      inquirer.prompt(questions)
        .then(answers => {
          const { name, type } = answers;
          componentName = name || componentName;
          switch (type) {
            case moduleType.fc:
              fc = true;
              break;
            case moduleType.cc:
              cc = true;
              break;
            case moduleType.sfc:
              sfc = true;
              break;
            case moduleType.h:
              h = true;
              break;
          }
          resolve(void 0);
        });
    }).catch(err => {
      handleException(err);
    });
  }

  if (!/^[a-zA-Z\_]\w+$/g.test(componentName)) {
    handleException(
      `Please input a valid module name(请输入合法的${module_cn}名称)!\n
      Rules(规则):\n
        1. The ${module_cn} name must greater-or-equal 2(${module_cn}名大于等于2个字符)\n
        2. The first character can only be underscore or upper/lower case letter(第一个字符只能由 下划线_ 或 大小写字母 组成)\n
        3. The subsequent characters can only be numberm, underscore, upper and lower case letter(后续字符只能由 数字、下划线_、大小写字母 组成)\n
      `
    );
  }

  // bind exit signals
  signal();

  const mdx = readme === 'mdx';
  const path_cp = path.resolve(root, componentName);
  const path_cp_rel = path.relative(process.cwd(), path_cp);

  if (fs.existsSync(path_cp)) {
    handleException(`The ${componentName} ${module_en} had been existed(${module_cn} ${componentName} 已存在)!`);
  }

  const hasStorybook = fs.existsSync(path.resolve(process.cwd(), '.storybook'));
  const params = [
    `componentName=${componentName}`,
    `newPath=${path_cp}`,
    `stylesheet=${stylesheet}`,
    `ts=${typescript}`,
    `type=${cc
      ? 'cc'
      : fc
        ? 'fc'
        : h
          ? 'h'
          : sfc
            ? 'sfc'
            : ''
    }`,
    `test=${!!test}`,
    `hasStorybook=${hasStorybook}`,
    readme ? `md=${mdx ? 'mdx' : 'md'}` : ''
  ];

  let newTplPkj = tplPkj;
  if (!newTplPkj) {
    switch (type) {
      case 'spa-react':
        newTplPkj = '@omni-door/tpl-spa-react';
        break;
      case 'spa-react-pc':
        newTplPkj = '@omni-door/tpl-spa-react-pc';
        break;
      case 'spa-vue':
        newTplPkj = '@omni-door/tpl-spa-vue';
        break;
      case 'ssr-react':
        newTplPkj = '@omni-door/tpl-ssr-react';
        break;
      case 'component-react':
        newTplPkj = '@omni-door/tpl-component-react';
        break;
      case 'component-vue':
        newTplPkj = '@omni-door/tpl-component-vue';
        break;
      case 'toolkit':
      default:
        newTplPkj = '@omni-door/tpl-toolkit';
        break;
    }
  }

  let templatePackageTag = tplPkjTag || 'latest';
  if (tplPkjTag) {
    const matchVer = tplPkjTag.match(/\d+.\d+/)?.[0];
    if (matchVer) {
      const versions = await getNpmVersions(newTplPkj);
      const [firstNum, secondNum] = matchVer.split('.');
      const regexp = new RegExp(`^${firstNum}{1}.${secondNum}{1}.\\d+$`);
      const thirdNum = Math.max(...versions.filter(v => regexp.test(v)).map(v => +(v.split('.')?.[2] ?? 0)));
      templatePackageTag = `${firstNum}.${secondNum}.${thirdNum}`;
    }
  }

  typeof before === 'function' && await before({
    componentName,
    root
  });

  const newTpl = `${newTplPkj}@${templatePackageTag}`;
  logInfo(`Downloading the ${newTpl}, please wait patiently(正在下载 ${newTpl}，请稍后)…`);
  exec(
    [
      `npx ${newTpl} new ${arr2str(params)}`
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
            componentType: cc ? 'class' : 'function',
            tplSource: newTplPkj!
          });
        }
      }
      typeof after === 'function' && await after({
        componentName,
        root
      });
      // success logger
      logSuc(`The ${componentName} local at ${path_cp_rel}, construction completed(${componentName} 位于 ${path_cp_rel}，创建完成)!`);
      process.exit(0);
    },
    function (err: any) {
      logErr(err);
      logErr('👆 Oops! Some error occured(完蛋！好像有错误)\n');
      process.exit(1);
    });
}