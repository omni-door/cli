# 接入文档(Docs)
@omni-door/cli 提供了二次开发的能力，通过 plugin 或者 import 到项目中实现。

## Plugin
插件向第三方开发者提供了脚手架在项目各个周期的执行多元化任务的能力，插件的编写请务必满足 `type OmniPlugin` 的类型定义。

### plugin 的类型
```ts
type OmniPlugin = {
  name: string;
  stage: PluginStage;
  handler: PluginHandler;
};

type PluginStage = 'new' | 'build' | 'release';
interface PluginHandler {
  (config: Omit<OmniConfig, 'plugins'>): Promise<any>;
  (config: Omit<OmniConfig, 'plugins'>, tpls: TPLS_NEW): Promise<TPLS_NEW_RETURE>;
}
```

### OmniConfig 的类型
```ts
type OmniConfig = {
  build: {
    tool: BUILD;
    configuration?: (config: { [propName: string]: any };) => { [propName: string]: any };;
    multi_output?: boolean;
    typescript?: boolean;
    test?: boolean;
    eslint?: boolean;
    stylelint?: boolean;
    reserve?: {
      style?: boolean;
      assets?: string[];
    }
    src_dir: string;
    out_dir: string;
    esm_dir?: string;
    auto_release?: boolean;
  };
  release: {
    git?: string;
    npm?: NPM | string;
    cdn?: string;
    test?: boolean;
    eslint?: boolean;
    stylelint?: boolean;
    commitlint?: boolean;
    branch?: string;
  };
  template: {
    root: string;
    type?: PROJECT_TYPE;
    test?: TESTFRAME;
    typescript?: boolean;
    stylesheet?: STYLE;
    readme?: boolean;
    mdx?: boolean;
  };
  plugins?: OmniPlugin[];
};

type NPM = 'npm' | 'yarn' | 'cnpm' | 'taobao';
type PROJECT_TYPE = 'spa_react' | 'component_library_react' | 'toolkit';
type TESTFRAME = 'mocha' | 'jest' | 'karma' | '';
type STYLE = 'less' | 'scss' | 'css' | 'all' | '';
```

- `name`：插件的名称

- `stage`：插件执行的阶段

- `handler`：执行的回调函数，以 `promise` 的形式返回

  - 通过 `import { PluginHandler_Release } from '@omni-door/cli/lib/index.d';` 获取 handle 应满足的类型
  - 支持： `PluginHandler_Build`、`PluginHandler_Release`、`PluginHandler_New`
---

## import 引入 command 命令
- `import { initial } from '@omni-door/cli';`：获取 initial 指令，传入参数直接调用：
```ts
initial({
  standard: true // 构建一个标准项目
}, {
  // 项目初始化开始前
  before: dir_name => ({
    create_dir: false // 避免新创建文件夹
  }),
  tpls: tpls => {
    // 改写 omni.config.js
    return {
      omni: configs => {
        let fn = tpls.omni;
        let fn2Str = fn.toString();
        fn2Str = fn2Str.replace('const path = require(\'path\');', 'const path = require(\'path\');\\nconst fs = require(\'fs\')');
        eval(`fn = ${fn2Str}`);

        return fn(configs);
      }
    };
  },
  dependencies: () => ['peeler-js'], // 安装项目依赖
  devDependencies: () => ['webpack-cli'], // 安装项目开发依赖
  // 项目初始化完成后
  after: () => {
    return {
      success: true,
      msg: '完成项目初始化构建'
    };
  }
});
```

- 同样支持其他阶段的命令：`import { new as newTpl, build, release } from '@omni-door/cli';`

- 支持自定义 logo 前缀：
  ```ts
  import { setLogo } from '@omni-door/cli';

  setLogo('自定义的前缀：');
  ```