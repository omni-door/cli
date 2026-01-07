# omni.config.js 详解

[English](./OMNI.md) | 简体中文

本文档说明 `omni.config.js` 支持的字段。

## 项目类型（`type`）
项目类型决定初始化、开发、构建以及模板生成的行为。

支持的类型：
- `spa-react` - React 单页应用
- `spa-react-pc` - 基于 [Antd](https://ant.design/) 的 React 中后台单页应用
- `spa-vue` - Vue 单页应用
- `ssr-react` - React 服务端渲染应用
- `component-react` - React 组件库
- `component-vue` - Vue 组件库
- `toolkit` - SDK/工具库

## 开发服务（`dev`）
开发服务基于 Express，配合常见中间件实现 HMR、接口代理等能力。

主要字段：
- `middleware` - 自定义中间件
- `webpack` - 开发环境 webpack 配置
- `proxy` - 代理配置（兼容 http-proxy-middleware）
- `port` - 端口号
- `host` - 启动 host
- `https` - 是否启用 HTTPS（可传 `key` 和 `cert`）
- `serverType` - 开发服务类型
- `favicon` - favicon 路径

中间件类型：
```ts
{
  route: string;
  callback: (req: any, res: any) => Promise<void>;
}
```

或工厂函数：
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

代理示例：
```ts
{
  route: '/api',
  config: {
    target: 'http://www.api.com/api',
    changeOrigin: true
  }
}
```

或工厂函数：
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

更多配置参考：https://github.com/chimurai/http-proxy-middleware

## 构建（`build`）
- `autoRelease` - 构建成功后是否自动发布
- `srcDir` - 源码目录
- `outDir` - 构建输出目录
- `esmDir` - ES module 输出目录
- `hash` - 是否为构建产物添加 hash（`contenthash`/`chunkhash`/`hash`）
- `configuration` - 自定义构建配置的回调
- `reserve` - 构建时保留的静态资源
  - `style` - 是否保留样式文件
  - `assets` - 额外需要拷贝的资源路径
- `preflight` - 构建前检查
  - `typescript` - 处理 TS/TSX
  - `test` - 运行单元测试
  - `eslint` - 运行 ESLint
  - `prettier` - 运行 Prettier
  - `stylelint` - 运行 Stylelint

## 发布（`release`）
- `autoBuild` - 发布前是否自动构建
- `autoTag` - 根据版本号自动设置 npm tag
- `git` - git 仓库地址
- `npm` - npm 仓库地址
- `preflight` - 发布前检查
  - `test` - 运行单元测试
  - `eslint` - 运行 ESLint
  - `prettier` - 运行 Prettier
  - `stylelint` - 运行 Stylelint
  - `commitlint` - 运行 commitlint
  - `branch` - 指定允许发布的分支（为空则不检查）

## 模板（`template`）
- `root` - 模板根目录
- `typescript` - 是否启用 TypeScript
- `test` - 是否生成测试文件
- `stylesheet` - 样式类型
- `readme` - `true` 或 `'mdx'` 生成 README

## 插件（`plugins`）
插件需满足以下类型：

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
