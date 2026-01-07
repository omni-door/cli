# omni.config.js Reference

English | [简体中文](./OMNI.zh-CN.md)

This document describes the fields supported by `omni.config.js`.

## Project Type (`type`)
The project type controls how initialization, development, build, and template generation behave.

Supported values:
- `spa-react` - React single-page application
- `spa-react-pc` - React SPA based on [Antd](https://ant.design/)
- `spa-vue` - Vue single-page application
- `ssr-react` - React server-side rendered app
- `component-react` - React component library
- `component-vue` - Vue component library
- `toolkit` - SDK/tooling library

## Dev (`dev`)
The dev server is built on Express and uses common middleware for HMR, proxying, and custom hooks.

Key fields:
- `middleware` - custom middleware configuration
- `webpack` - webpack configuration for the dev server
- `proxy` - proxy configuration (http-proxy-middleware compatible)
- `port` - dev server port
- `host` - dev server host
- `https` - enable HTTPS (can provide `key` and `cert`)
- `serverType` - dev server type
- `favicon` - favicon path

Middleware types:
```ts
{
  route: string;
  callback: (req: any, res: any) => Promise<void>;
}
```

Or a factory:
```ts
(params: {
  ip: string;
  port: number;
  host?: string;
  proxyConfig?: (ProxyItem | ProxyFn)[];
}) => {
  route: string;
  callback: (req: any, res: any) => Promise<void>;
}
```

Proxy example:
```ts
{
  route: '/api',
  config: {
    target: 'http://www.api.com/api',
    changeOrigin: true
  }
}
```

Or a factory:
```ts
(params: {
  ip: string;
  port: number;
  host?: string;
  middlewareConfig?: (MiddlewareItem | MiddlewareFn)[];
}) => {
  route: string;
  config: Config;
}
```

More proxy options: https://github.com/chimurai/http-proxy-middleware

## Build (`build`)
- `autoRelease` - release automatically after a successful build
- `srcDir` - source directory
- `outDir` - build output directory
- `esmDir` - ES module output directory
- `hash` - add hashes to build output (`contenthash`, `chunkhash`, `hash`)
- `configuration` - callback to customize the build configuration
- `reserve` - assets to keep without bundling
  - `style` - keep stylesheets in output
  - `assets` - extra asset paths to copy
- `preflight` - checks before build
  - `typescript` - process TS/TSX
  - `test` - run unit tests
  - `eslint` - run ESLint
  - `prettier` - run Prettier
  - `stylelint` - run Stylelint

## Release (`release`)
- `autoBuild` - build automatically before release
- `autoTag` - derive npm tag from version
- `git` - git repository URL
- `npm` - npm registry URL
- `preflight` - checks before release
  - `test` - run unit tests
  - `eslint` - run ESLint
  - `prettier` - run Prettier
  - `stylelint` - run Stylelint
  - `commitlint` - run commitlint
  - `branch` - only allow release from the specified branch (empty disables)

## Template (`template`)
- `root` - template root directory
- `typescript` - enable TypeScript
- `test` - generate unit tests
- `stylesheet` - stylesheet type
- `readme` - `true` or `'mdx'` to generate README files

## Plugins (`plugins`)
Plugins must match the following types:

```ts
type OmniPlugin = {
  name: string;
  stage: PLUGIN_STAGE;
  handler: PluginHandler;
};

type PLUGIN_STAGE = 'new' | 'build' | 'release';
interface PluginHandler {
  (config: Omit<OmniConfig, 'plugins'>): Promise<any>;
}
```
