# 变更日志

## v1.2.x
### v1.2.7
1. [omni release] 发布过程的异常处理逻辑更改

2. [omni release] 发布到npm仓库显示指定registry

3. [omni release] 发布到git仓库避免修改origin

4. 插件运行新增try/catch异常处理

### v1.2.6
1. (initial) 支持 tplPkjParams 选项

2. [omni build] 移除自动发布的时间日志

### v1.2.5
1. [omni release] 修复版本检测的问题

### v1.2.4
1. [omni release] 修复 分支检测和npm发布log前缀不正确的问题

2. 升级 @omni-door/tpl-utils 依赖

### v1.2.3
1. [omni release] 汉化翻译

2. 升级 @omni-door/tpl-utils 依赖

3. [omni initial/build/release] 新增耗时日志输出

### v1.2.2
1. [omni build] rollup 打包新增未正确发现入口文件的提示

2. (newTpl、initial) 支持 tplPkj 选项

3. [omni new] 恢复 plugin 的支持

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
1. <package.json> 新增 resolutions 字段，解决 [依赖重复导致TS报错](https://stackoverflow.com/questions/52399839/duplicate-identifier-librarymanagedattributes) 的问题

2. [onmi init] stable 策略版本更新

3. [onmi init] component-library-react 和 toolkit 默认开启单元测试

---

## v1.0.x
### v1.0.10
1. (node-version-check) 修复node版本检测问题

2. [onmi init] 动态更新初始化总步数

3. [onmi build] 修复错误日志丢失的问题

4. [onmi release] 修复错误日志丢失的问题

### v1.0.9
1. <package.json> 新增 stylelint 检测启动参数 {--allow-empty-input}

2. <package.json> 新增 jest 单元测试启动参数 {--passWithNoTests}

3. <tsconfig.json> 移除 allowJs、experimentalDecorators 的注释，更新 {exclude} 字段

4. <webpack.config.prod.js> 新增 webpack-bundle-analyzer 插件

5. <.npmignore> 生成基于项目类型

6. [onmi init] 支持样式多选

### v1.0.8
1. [omni init] 修复自定义Logo显示不正确问题

2. [omni init] 支持移除内置的依赖项

### v1.0.7
1. <tsconfig.json> 模板新增对项目类型判断

2. <omni.config.js> 注释变更

3. <webpack.config.prod.js> 优化生产环境打包

4. (dev-server) 新增运行时错误捕获

5. [omni new] 修复无法识别参数的问题

### v1.0.6
1. 新增对 node 版本做检测，要求 node >= 10.13.0

### v1.0.5
1. <omni.config.js>, 新增 `dev.middleware` 字段

2. <omni.config.js>, 新增 `dev.logLevel` 字段

3. <omni.config.js>, `dev.webpack_config` 更变为 `dev.webpack`

### v1.0.4
1. (dev-server) 启动进程优化

2. [omni init] 更改 `omni init -s` 和 `omni init --simple` 为 `omni init -b` 和 `omni init -basic`

### v1.0.3
1. [omni build] 自动发布优化，摆脱依赖npm script，直接调用release方法

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

- [xxx] - 命令

- (xxx) - 功能