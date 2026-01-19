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
  logWarn(msg || 'Oops! Some unknown errors have occurred!');
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
    handleException('Please initialize first!');
  }

  const {
    type,
    template,
    build,
    release,
    plugins
  } = config!;

  if (!type) {
    handleException('Cannot find the project type!');
  }

  const {
    root,
    test,
    typescript = false,
    stylesheet = '',
    readme = false
  } = template!;

  let module_en = 'component';
  if (type === 'toolkit') {
    module_en = 'module';
  }

  // eslint-disable-next-line prefer-const
  let { function: fc, class: cc, render: h, single: sfc, tplPkj, tplPkjTag, before, after } = options || {};

  if (!root) {
    handleException(`Missing the path for generating the ${module_en}!`);
  }

  if (!componentName || (!fc && !cc && !h && !sfc)) {
    const moduleType = {
      fc: 'Function Component',
      cc: 'Class Component',
      h: 'Render Function',
      sfc: 'Single File Component',
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
        message: `${logo()} Please enter ${module_en} name:`
      },
      {
        name: 'type',
        type: 'list',
        when: (answer: any) => {
          if (!answer.name && !componentName) {
            handleException(`Please input the ${module_en} name!`);
          }
          if (type === 'spa-vue' || type === 'toolkit' || fc || cc) {
            return false;
          }
          return true;
        },
        choices: type === 'component-vue' ? [ moduleType.h, moduleType.sfc ] : [ moduleType.fc, moduleType.cc ],
        message: `${logo()} Select the type of ${module_en}:`
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
      `Please input a valid ${module_en} name!\n
      Rules:\n
        1. The ${module_en} name must be at least 2 characters.\n
        2. The first character must be underscore or a letter.\n
        3. Subsequent characters can only be numbers, underscore, or letters.\n
      `
    );
  }

  // bind exit signals
  signal();

  const mdx = readme === 'mdx';
  const path_cp = path.resolve(root, componentName);
  const path_cp_rel = path.relative(process.cwd(), path_cp);

  if (fs.existsSync(path_cp)) {
    handleException(`The ${module_en} ${componentName} already exists!`);
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
  logInfo(`Downloading ${newTpl}, please wait...`);
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
      logSuc(`The ${componentName} is created at ${path_cp_rel}.`);
      process.exit(0);
    },
    function (err: any) {
      logErr(err);
      logErr('👆 Oops! An error occurred.\n');
      process.exit(1);
    });
}
