# omni.config.js 详解

## type 项目类型
OMNI 会根据不同的项目类型决定整个初始化、构建、创建模板的过程

目前支持的项目类型有：

- spa-react - React单页应用

- component-library-react - React组件库

- toolkit - SDK工具包

## dev 开发服务
开发服务基于express，搭配 webpack-dev-middleware、webpack-hot-middleware、http-proxy-middleware 等中间件，实现了热更新、接口代理等常用功能，并提供了中间件的自定义、端口号、log日志输出级别、webpack配置等个性化定制方案。

- middleware - 中间件配置，参考下面👇的类型：

    ```ts
    {
      route: string;
      callback: (req: any, res: any) => Promise<void>;
    }
    ```

- webpack - 开发服务端webpack配置

- proxy - 开发服务代理配置

    ```js
    {
      route: '/api', // 代理API的本地服务的地址
      config: {
        target: 'http://www.api.com/api', // 代理API的实际地址
        changeOrigin: true // 是否改变host
      }
    }
    ```

    更多配置详见 [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)

- port - 开发服务启动的端口号

- logLevel - 开发服务日志输出等级，可选 'debug'、'info'、'warn'、'error'、'silent'

## build 构建配置

- autoRelease - 构建完成后是否自动发布

- srcDir - 构建资源输入路径

- outDir - 构建结果输出路径

- esmDir - 构建结果输出路径(符合es6 module规范)

- hash - 构建的资源是否加上hash

- configuration - 构建阶段的自定义配置回调，返回自定义的配置

- reserve - 配置未经过打包，但需要保留进构建结果的资源
  - style - 构建结果是否保留样式文件

  - assets - 构建结果保留其他资源的路径

- preflight - 构建前的飞行检查
  - typescript - 是否处理ts或tsx文件

  - test - 是否进行单元测试 

  - eslint - 是否进行eslint检测

  - stylelint - 是否进行stylelint检测

## release
- git - 发布的git仓库地址

- npm - 发布的npm仓库地址

- preflight - 发布前的飞行检查
  - test - 发布前是否进行单元测试

  - eslint - 发布前是否进行eslint检测

  - stylelint - 发布前是否进行stylelint检测

  - commitlint - 发布前是否进行单元测试commitlint检测

  - branch - 发布前进行分支检测，设置为空字符串则不会检测

## template 新建模板配置
- root - 生成模板的根路径

- typescript - 是否创建ts文件

- test - 是否创建单元测试文件

- stylesheet - 样式文件类型

- readme - [true, 'mdx'] ([是否生成ReadMe文件, 创建md 或 mdx文件])

## plugins
插件集合，插件需满足下面的类型：

```ts
type OmniPlugin = {
  name: string;
  stage: PluginStage;
  handler: PluginHandler;
};

type PluginStage = 'new' | 'build' | 'release';
interface PluginHandler {
  (config: Omit<OmniConfig, 'plugins'>): Promise<any>;
}
```