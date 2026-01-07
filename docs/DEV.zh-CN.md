# 插件与 API 文档

[English](./DEV.md) | 简体中文

**@omni-door/cli** 支持通过插件或直接引用的方式扩展能力。插件可在 `new`、`build`、`release` 阶段执行。

---

## 示例：release 阶段进行 gzip 压缩

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
  };
}
```

## 插件类型
```ts
type PLUGIN_STAGE = 'new' | 'build' | 'release';

interface OmniPlugin<T extends PLUGIN_STAGE> {
  name: string;
  stage: T;
  handler: PluginHandler<T>;
}

interface PluginHandler<T extends PLUGIN_STAGE> {
  (
    config: Omit<OmniConfig, 'dev' | 'plugins'>,
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

## OmniConfig 类型
```ts
import type { Configuration } from 'webpack';
import type { Config } from 'http-proxy-middleware';
import type { Options as DevMiddlewareOptions } from 'webpack-dev-middleware';
import type { Request, Response, NextFunction } from 'express';
import type * as KoaApp from 'koa';

type ANY_OBJECT = { [propName: string]: any };
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

interface OmniBaseConfig {
  type: PROJECT_TYPE;
  dev?: OmniServer & {
    devMiddlewareOptions?: Partial<DevMiddlewareOptions>;
    webpack?: Configuration | (() => Configuration);
    configuration?: (config: ANY_OBJECT) => ANY_OBJECT;
    serverType?: ServerType;
    favicon?: string;
  };
  server?: OmniServer & { serverType?: SSR_SERVER; };
  build: {
    autoRelease?: boolean;
    srcDir: string;
    outDir: string;
    esmDir?: string;
    hash?: boolean | HASH;
    configuration?: (config: ANY_OBJECT) => ANY_OBJECT;
    tool?: Exclude<BUILD, 'rollup'>;
    preflight?: {
      typescript?: boolean;
      test?: boolean;
      eslint?: boolean;
      prettier?: boolean;
      stylelint?: boolean;
    };
    reserve?: {
      style?: boolean;
      assets?: (string | { srcPath: string; relativePath?: string; })[];
    };
  };
  release: {
    git?: string;
    npm?: string | boolean;
    autoBuild?: boolean;
    autoTag?: boolean;
    preflight?: {
      test?: boolean;
      eslint?: boolean;
      prettier?: boolean;
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
    readme?: MARKDOWN | boolean;
  };
  plugins?: OmniPlugin<PLUGIN_STAGE>[];
}

interface OmniRollupConfig extends OmniBaseConfig {
  build: OmniBaseConfig['build'] & {
    tool: Extract<BUILD, 'rollup'>;
    configuration?: (getConfig: (bundle: boolean) => ANY_OBJECT) => ANY_OBJECT;
  };
}

type OmniConfig = OmniBaseConfig | OmniRollupConfig;
```

说明：
- `name`：插件名称
- `stage`：插件执行阶段
- `handler`：异步回调函数，返回 `Promise`
- 类型可从 `@omni-door/cli/lib/index.d` 获取（如 `PluginHandler_Release`）
