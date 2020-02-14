# CHANGE LOG

## v1.0.x
### v1.0.0
1. 新增 `omni dev` 命令以支持基于 Express + webpack-dev-server 的开发服务

### v1.0.1
1. 优化了log日志的输出

### v1.0.2
1. toolkit 项目支持使用 tsc 打包

### v1.0.3
1. [omni build] 自动发布优化，摆脱依赖npm script，直接调用release方法

### v1.0.4
1. (dev-server) 启动进程优化

2. [omni init] 更改 `omni init -s` 和 `omni init --simple` 为 `omni init -b` 和 `omni init -basic`

### v1.0.5
1. <omni.config.js>, 新增 `dev.middleware` 字段

2. <omni.config.js>, 新增 `dev.logLevel` 字段

3. <omni.config.js>, `dev.webpack_config` 更变为 `dev.webpack`

### v1.0.6
1. 新增对 node 版本做检测，要求 node >= 10.13.0

### v1.0.7
1. <tsconfig.json> 模板新增对项目类型判断

2. <omni.config.js> 注释变更

3. <webpack.config.prod.js> 优化生产环境打包

4. (dev-server) 新增运行时错误捕获

5. [omni new] 修复无法识别参数的问题

### v1.0.8
1. [omni init] 修复自定义Logo显示不正确问题

2. [omni init] 支持移除内置的依赖项

### v1.0.9
1. <package.json> 新增 stylelint 检测启动参数 {--allow-empty-input}

2. <package.json> 新增 jest 单元测试启动参数 {--passWithNoTests}

3. <tsconfig.json> 移除 allowJs、experimentalDecorators 的注释，更新 {exclude} 字段

4. <webpack.config.prod.js> 新增 webpack-bundle-analyzer 插件

5. <.npmignore> 生成基于项目类型

6. [onmi init] 支持样式多选

### v1.0.10
1. (node-version-check) 修复node版本检测问题

2. [onmi init] 动态更新初始化总步数

3. [onmi build] 修复错误日志丢失的问题

4. [onmi release] 修复错误日志丢失的问题

---

## v0.2.x
1. 正式稳定版本

## v0.1.x
1. 可用版本，请使用最新版本

## v0.0.x
1. 非正式版本，请使用最新版本