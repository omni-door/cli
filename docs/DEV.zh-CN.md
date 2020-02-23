# 接入文档
@omni-door/cli 提供了二次开发的能力，通过 plugin 或者 import 到项目中实现。

---

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
import { Configuration } from 'webpack';
import { Config } from 'http-proxy-middleware';

type OmniConfig = {
  type: PROJECT_TYPE;
  dev: {
    port?: number;
    webpack?: Configuration;
    proxy?: {
      route: string;
      config: Config;
    }[];
    logLevel: 'debug' | 'info' | 'warn' | 'error' | 'silent';
  };
  build: {
    autoRelease?: boolean;
    srcDir: string;
    outDir: string;
    esmDir?: string;
    configuration?: (config: ANYOBJECT) => ANYOBJECT;
    tool?: BUILD;
    preflight?: {
      typescript?: boolean;
      test?: boolean;
      eslint?: boolean;
      stylelint?: boolean;
    };
    reserve?: {
      style?: boolean;
      assets?: string[];
    };
  };
  release: {
    git?: string;
    npm?: NPM | string;
    preflight?: {
      test?: boolean;
      eslint?: boolean;
      stylelint?: boolean;
      commitlint?: boolean;
      branch?: string;
    };
  };
  template: {
    root: string;
    test?: boolean;
    typescript?: boolean;
    stylesheet?: STYLE;
    readme?: [boolean, 'mdx' | 'md'];
  };
  plugins?: OmniPlugin[];
};

export type BUILD = 'webpack' | 'rollup' | 'tsc' | '';
type NPM = 'npm' | 'yarn' | 'cnpm' | 'taobao';
type PROJECT_TYPE = 'spa-react' | 'component-library-react' | 'toolkit';
type STYLE = 'less' | 'scss' | 'css' | 'all' | '';
```

- `name`：插件的名称

- `stage`：插件执行的阶段

- `handler`：执行的回调函数，以 `promise` 的形式返回

  - 通过 `import { PluginHandler_Release } from '@omni-door/cli/lib/index.d';` 获取 handle 应满足的类型
  - 支持： `PluginHandler_Dev`、`PluginHandler_Build`、`PluginHandler_Release`、`PluginHandler_New`
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
    // 项目初始化完成后
    after: () => {
      return {
        success: true,
        msg: '完成项目初始化构建'
      };
    },
    // 自定义安装的模板
    tplPkj: '@omni-door/tpl-toolkit',
    // 自定义 omni.config.js 文件名称
    configFileName: 'custom.config.js'
  });
  ```

- 其他阶段的命令同样支持：`import { dev, new as newTpl, build, release } from '@omni-door/cli';`

- 支持自定义 logo、brand 前缀：
  ```ts
  import { setLogo, setBrand } from '@omni-door/cli';

  setLogo('😄');
  setBrand('自定义的前缀：');
  ```