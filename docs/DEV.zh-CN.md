# 接入文档

[English](./DEV.md) | 简体中文

@omni-door/cli 提供了二次开发的能力，通过 plugin 或者 import 到项目中实现。

---

## Plugin
插件向第三方开发者提供了脚手架在项目各个周期的执行多元化任务的能力，插件的编写请务必满足 `type OmniPlugin` 的类型定义。

### 编写一个 release 阶段做压缩打包的插件

```js
import pack from 'pack'; // 压缩的伪代码

export default function (config, options) {
  return {
    name: '@scope/my-release-plugin',
    stage: 'release',
    handler: config => new Promise((resolve, reject) => {
      const { build } = config;
      const srcPath = build.outDir;
      const destPath = path.resolve(process.cwd(), 'dist.zip');
      // 压缩打包
      pack(srcPath, destPath, function (res) {
        if (res === 'success') {
          return resolve();
        }
        return reject();
      });
    })
  });
}
```

### plugin 的类型
```ts
type PLUGIN_STAGE = 'new' | 'build' | 'release';

interface OmniPlugin<T extends PLUGIN_STAGE> {
  name: string;
  stage: T;
  handler: PluginHandler<T>;
}

interface PluginHandler<T extends PLUGIN_STAGE> {
  (
    config: config: Omit<OmniConfig, 'dev' | 'plugins'>,
    options?: T extends 'new' ? OptionTemplate : T extends 'build' ? OptionBuild : OptionRelease
  ): Promise<any>;
}

// "new" 阶段
type OptionTemplate = {
  componentName: string;
  componentType: 'function' | 'class';
  tplSource: string;
};

// "build" 阶段
type OptionBuild = {
  verify?: boolean;
  buildConfig?: string;
};

// "release" 阶段
type OptionRelease = {
  version: string;
  versionIterTactic: 'ignore' | 'manual' | 'auto';
  verify?: boolean;
  tag?: string;
};
```

### OmniConfig 的类型
```ts
import type { Configuration } from 'webpack';
import type { Config } from 'http-proxy-middleware';
import type { Options as DevMiddlewareOptions } from 'webpack-dev-middleware';
import type { Request, Response, NextFunction } from 'express';
import type * as KoaApp from 'koa';

type ServerType = 'storybook' | 'dumi' | 'default';
type BUILD = 'webpack' | 'rollup' | 'gulp' | 'tsc' | 'next' | '';
type NPM = 'npm' | 'yarn' | 'pnpm';
type PROJECT_TYPE = 'spa-react' | 'spa-react-pc' | 'spa-vue' | 'ssr-react' | 'component-react' | 'component-vue' | 'toolkit';
type STYLE = 'less' | 'scss' | 'css' | 'all' | '';
type SSR_SERVER = 'next-app' | 'next-pages' | 'nuxt' | '';
type Method = 'get' | 'GET' | 'post' | 'POST' | 'put' | 'PUT' | 'del' | 'DEL';

type OmniServer = {
  port?: number;
  host?: string;
  https?: boolean | { key: string; cert: string; };
  CA?: {
    organization?: string;
    countryCode?: string;
    state?: string;
    locality?: string;
    validityDays?: number;
  };
  proxy?: {
    route: PathParams;
    config: Config;
  }[];
  middleware?: {
    route: PathParams;
    callback: MiddleWareCallback;
    method?: Method;
  }[];
  cors?: {
    origin?: string | ((ctx: KoaCtx) => string);
    allowMethods?: string | string[];
    exposeHeaders?: string | string[];
    allowHeaders?: string | string[];
    maxAge?: string | number;
    credentials?: boolean | ((ctx: KoaCtx) => string);
    keepHeadersOnError?: boolean;
    secureContext?: boolean;
    privateNetworkAccess?: boolean;
  };
  nextRouter?: NextRouter;
};

interface OmniConfig {
  type: PROJECT_TYPE;
    dev?: OmniServer & {
    devMiddlewareOptions?: Partial<DevMiddlewareOptions>;
    webpack?: Configuration | (() => Configuration);
    serverType?: ServerType;
    favicon?: string;
  };
  server?: OmniServer & { serverType?: SSR_SERVER; };
  build: {
    autoRelease?: boolean;
    srcDir: string;
    outDir: string;
    esmDir?: string;
    hash?: boolean;
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
      assets?: (string | { srcPath: string; relativePath?: string; })[];
    };
  };
  release: {
    git?: string;
    npm?: string;
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
  plugins?: OmniPlugin<PLUGIN_STAGE>[];
}
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
    // 自定义模板需要传入的参数
    tplPkjParams: ['bid=55232', 'test=false'],
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