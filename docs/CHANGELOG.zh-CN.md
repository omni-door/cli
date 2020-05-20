# 变更日志

## v1.2.x
### v1.2.33
1. (omni release) 删除会导致版本号不正确的缓存

### v1.2.32
1. [fix bug] 修复构建/发布完成后未退出程序的问题

### v1.2.31
1. (omni release) 修复linux环境下版本无法迭代的问题

### v1.2.30
1. (omni dev) proxy 支持传入 `function` 类型

### v1.2.29
1. (omni dev) middleware 支持传入 `function` 类型

2. 升级 @omni-door/utils

### v1.2.28
1. <omni.config.js> `dev` 字段新增 `devMiddlewareOptions` 属性，对应 `webpack-dev-middleware` [Options](https://github.com/webpack/webpack-dev-middleware#options)

### v1.2.27
1. [dependency upgrade] commander@5.1.0

### v1.2.26
1. [fix bug] 移除 commandar 自动输出 help 信息的逻辑

### v1.2.25
1. [dependency upgrade] commander@4.1.0

2. (omni init) 提升参数 `tplPkjParams` 的权重

### v1.2.24
1. [fix bug] 依赖固定版本号

### v1.2.23
1. [fix bug] 修复重名文件夹的检测的问题

2. (omni init) 项目重名支持重新输入，最大10次

### v1.2.22
1. (omni init) 初始化时新增对重名文件夹的检测和覆盖确认提示

### v1.2.21
1. [logic fix] 初始化时选择 no-install 不会出现安装工具的选择

### v1.2.20
1. (omni init) 新增初始化时不安装依赖的选项

### v1.2.19
1. 升级 @omni-door/utils

2. [new plugin] 回调参数新增“模板来源”(tplSource)

3. [build plugin] 回调参数新增“自定义的构建配置”(buildConfig)

4. [release plugin] 回调参数新增“版本迭代策略”(versionIterTactic)

### v1.2.18
1. [fix bug] 修复 logo 未被正确替换的问题

### v1.2.17
1. (omni new) 移除组件名自动大写第一个字母的逻辑

2. (omni build) tookit 打包模板修改

3. (omni release) 修复commitlint遗漏verify参数的问题

### v1.2.16
1. 升级 @omni-door/utils

2. 移除错误输出信息中多余的 `JSON.stringify`

3. 为 `process` 绑定 `'SIGINT', 'SIGQUIT', 'SIGTERM'` 事件，监听退出程序

4. (omni dev/build) 修复 `require` 无法获取工作路径的依赖的问题

### v1.2.15
1. 优化异常操作处理

2. @omni-door/utils 替换 @omni-door/tpl-utils

3. (omni dev) 采用 create-react-app (复用已打开浏览器的tab策略)[https://github.com/facebook/create-react-app/blob/32eebfeb7f5cdf93a790318eb76b81bb2927458e/packages/react-dev-utils/openChrome.applescript]

### v1.2.14
1. (omni build/release) 支持 prettier 飞行检查

2. (omni build) 新增对于自定义配置文件是否存在的校验

3. (omni init) component-library-react项目新增 styleguidist Demo框架的选择

### v1.2.13
1. (omni build) 当 catch[try/catch] 到错误时，停止 loading 状态

2. (omni init) 集成 prettier

### v1.2.12
1. (omni build) 支持自定义配置文件路径

2. (omni build) 修复输出资源是否存在的校验的bug

### v1.2.11
1. (omni build) 支持 "hash"、"chunkhash"、"contenthash"

2. 升级依赖 @omni-door/tpl-utils

### v1.2.10
1. [initial] before 和 after 支持异步执行

2. [newTpl] 支持 before 和 after 回调

### v1.2.9
1. (omni dev) 新增 Signals listener

2. 升级依赖 @omni-door/tpl-utils

3. (omni dev) 修复 history API 路由不正确的问题

### v1.2.8
1. 插件新增 `options` 参数，并更新 type 定义

### v1.2.7
1. (omni release) 发布过程的异常处理逻辑更改

2. (omni release) 发布到npm仓库显示指定registry

3. (omni release) 发布到git仓库避免修改origin

4. (omni release) 新增 tag 选项

5. 插件运行新增try/catch异常处理

### v1.2.6
1. [initial] 支持 tplPkjParams 选项

2. (omni build) 移除自动发布的时间日志

### v1.2.5
1. (omni release) 修复版本检测的问题

### v1.2.4
1. (omni release) 修复 分支检测和npm发布log前缀不正确的问题

2. 升级 @omni-door/tpl-utils 依赖

### v1.2.3
1. (omni release) 汉化翻译

2. 升级 @omni-door/tpl-utils 依赖

3. (omni initial/build/release) 新增耗时日志输出

### v1.2.2
1. (omni build) rollup 打包新增未正确发现入口文件的提示

2. [newTpl、initial] 支持 tplPkj 选项

3. (omni new) 恢复 plugin 的支持

### v1.2.1
1. 拆分模板
  - @omni-door/tpl-spa-react

  - @omni-door/tpl-toolkit

  - @omni-door/tpl-component-library-react

### v1.2.0
1. 命名规范

## v1.1.x
### v1.1.3
1. <omni.config.js> 修复无法由于循环引用导致webpack配置文件无法获取正确值的问题

2. <webpack.config.prod.js> 新增 html-webpack-plugin

3. <webpack.config.dev.js> 将css、less、scss等样式文件的处理迁移至此

### v1.1.2
1. <omni.config.js> build 新增 hash 字段控制打包资源名是否添加哈希

2. 新增 omni.config.js 详解文档

### v1.1.1
1. <package.json> 修复函数的调用栈在转化成字符串后丢失，无法正确获取到变量值的问题

### v1.1.0
1. <package.json> 新增 resolutions 字段，解决 (依赖重复导致TS报错)[https://stackoverflow.com/questions/52399839/duplicate-identifier-librarymanagedattributes] 的问题

2. (onmi init) stable 策略版本更新

3. (onmi init) component-library-react 和 toolkit 默认开启单元测试

---

## v1.0.x
### v1.0.10
1. [node-version-check] 修复node版本检测问题

2. (onmi init) 动态更新初始化总步数

3. (onmi build) 修复错误日志丢失的问题

4. (onmi release) 修复错误日志丢失的问题

### v1.0.9
1. <package.json> 新增 stylelint 检测启动参数 {--allow-empty-input}

2. <package.json> 新增 jest 单元测试启动参数 {--passWithNoTests}

3. <tsconfig.json> 移除 allowJs、experimentalDecorators 的注释，更新 {exclude} 字段

4. <webpack.config.prod.js> 新增 webpack-bundle-analyzer 插件

5. <.npmignore> 生成基于项目类型

6. (onmi init) 支持样式多选

### v1.0.8
1. (omni init) 修复自定义Logo显示不正确问题

2. (omni init) 支持移除内置的依赖项

### v1.0.7
1. <tsconfig.json> 模板新增对项目类型判断

2. <omni.config.js> 注释变更

3. <webpack.config.prod.js> 优化生产环境打包

4. [dev-server] 新增运行时错误捕获

5. (omni new) 修复无法识别参数的问题

### v1.0.6
1. 新增对 node 版本做检测，要求 node >= 10.13.0

### v1.0.5
1. <omni.config.js>, 新增 `dev.middleware` 字段

2. <omni.config.js>, 新增 `dev.logLevel` 字段

3. <omni.config.js>, `dev.webpack_config` 更变为 `dev.webpack`

### v1.0.4
1. [dev-server] 启动进程优化

2. (omni init) 更改 `omni init -s` 和 `omni init --simple` 为 `omni init -b` 和 `omni init -basic`

### v1.0.3
1. (omni build) 自动发布优化，摆脱依赖npm script，直接调用release方法

### v1.0.2
1. toolkit 项目支持使用 tsc 打包

### v1.0.1
1. 优化了log日志的输出

### v1.0.0
1. 新增 `omni dev` 命令以支持基于 Express + webpack-dev-server 的开发服务

---

## v0.2.x
1. 正式稳定版本

## v0.1.x
1. 可用版本，请使用最新版本

## v0.0.x
1. 非正式版本，请使用最新版本

---

**标签的含义**：
- \<xxx> - 模板

- (xxx) - 命令

- [xxx] - 行为、特性、功能