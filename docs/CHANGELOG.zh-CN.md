# 变更日志

[English](./CHANGELOG.md) | 简体中文

## v2.9.x
### v2.9.9
1. 「fix」`omni build` vue 文件没有生成声明文件
2. 「fix」`omni build` `.vue` 后缀转换成 `.js`

### v2.9.8
1. 「update」`omni build` 用 ts-patch 替代 ttypescript

### v2.9.7
1. 「update」`omni build` gulp 排除 `*.{demo,test,stories}.{vue,ts,tsx,js,jsx}` 文件构建

### v2.9.6
1. 「feat」`omni new` 指定模版的版本

### v2.9.5
1. 「feat」`omni init` 指定模版的版本

### v2.9.4
1. 「chore」`omni init` 添加 init 命令日志

### v2.9.3
1. 「update」`omni dev` storybook 开发命令变更

### v2.9.2
1. 「update」`omni build` gulp-sass 手动引入 sass

### v2.9.1
1. 「update」`omni init` 添加 deprecated 和 recommend 提示


### v2.9.0
1. 「chore」升级 express 和 node-sass

## v2.8.x
### v2.8.2
1. 「fix」`omni start` 移除最新版本提示避免网络阻塞

### v2.8.1
1. 「optimization」node 进程异常信号监听

### v2.8.0
1. 「feat」中间件支持 http 方法

2. 「chore」升级 @omni-door/utils

## v2.7.x
### v2.7.5
1. 「fix」`koa-next` 服务中间件

### v2.7.4
1. 「update」移除 `handleKoaApp` 的支持

2. 「update」新增 `cors` 的支持

### v2.7.3
1. 「update」`ssr-react` 下的 `koa-next` 服务，支持通过 `handleKoaApp` 回调操作KoaApp

### v2.7.2
1. 「fix」`omni start` 缺失 middleware 和 https 参数

### v2.7.1
1. 「update」`omni init` ssr-react 移除样式选择

### v2.7.0
1. 「optimization」`omni init` 和 `omni release` REPL 交互提升

2. 「upgrade」升级 @omni-door/utils

3. 「feat」支持 React@18

## v2.6.x
### v2.6.4
1. 「upgrade」inquirer | mkcert

### v2.6.2
1. 「fix」`omni build` 未能支持 `spa-react-pc` 项目

### v2.6.1
1. 「fix」`omni new` 和 `omni build` 未能支持 `spa-react-pc` 项目

### v2.6.0
1. 「feat」支持 `spa-react-pc` 项目

## v2.5.x
### v2.5.8
1. 「optimization」`omni build` 和 `omni release` log 输出优化

### v2.5.7
1. 「update」升级 *shelljs* 解决循环依赖的警告

### v2.5.6
1. 「fix」 `omni build` gulp 打包 *.vue* 文件后缀名转换

2. 「update」 `omni build` dependencies_build 依赖版本更新

3. 「optimization」 `omni release` 从版本中自动获取tag时，`rc` 会强制转换成 `latest`

### v2.5.5
1. 「optimization」 `omni build` gulp 打包自定义暴露完整配置项

### v2.5.4
1. 「optimization」 `omni build` gulp 打包支持自定义配置

### v2.5.3
1. 「fix」 `omni build` gulp 打包替换 vue-SFC 文件路径

### v2.5.2
1. 「optimization」 `omni build` gulp 打包编译 vue-SFC 文件

### v2.5.1
1. 「optimization」 `omni build` gulp 打包支持 vue SFC

2. 「feat」 `omni new` *component-vue* 项目支持 SFC 和 Render-Function

### v2.5.0
1. 「feat」 `omni build` gulp 打包支持 css 路径拼接并替换 css-minifier

## v2.4.x
### v2.4.9
1. 「update」 `omni release` 将插件的处理程序置于 git 和 npm 的操作之前

### v2.4.8
1. 「optimization」 `omni release` tag 和 plugin handler

2. 「upgrade」升级 @omni-door/utils

### v2.4.7
1. 「optimization」 `omni init` 在 *component-react* 项目中，选择 *docz* 作为 demo 框架时，检查 node 版本是否 `>= 12`

### v2.4.6
1. 「chore」 `omni new` 名称提示

2. 「optimization」 `omni dev` 打开浏览器之前先确保端口已经被占用

### v2.4.5
1. 「optimization」 `omni release` 操作git前先检查状态

### v2.4.4
1. 「update」 `omni dev` 打开浏览器延时

### v2.4.3
1. 「optimization」 `omni release` npm publish 支持两步验证(OTP)

### v2.4.2
1. 「optimization」 `omni build` rollup 自定义配置文件的参数传递

### v2.4.1
1. 「fix」 `omni init` 覆写的工作路径

### v2.4.0
1. 「optimization」 更新 cli 的提示

2. 「feat」支持 `component-vue` 项目

## v2.3.x

### v2.3.11
1. 「fix」 匹配版本号的正则表达式

### v2.3.10
1. 「optimization」 日志优化

2. 「fix」 `omni build` 无法删除在工作路径之外的文件或文件夹

### v2.3.9
1. 「optimization」 日志优化

### v2.3.8
1. 「optimization」 日志优化

### v2.3.7
1. 「optimization」 `omni release` 迭代优化

### v2.3.6
1. 「fix」 `omni build` rollup 中的 typescript插件，影响输出结果的问题

### v2.3.5
1. 「fix」 `omni release` 自动迭代版本号的 tag 不正确

### v2.3.4
1. 「optimization」 `omni release` 自动迭代版本号策略顺序优化

### v2.3.3
1. 「optimization」 `omni init` 单元测试 `spa-vue` 项目默认不选

2. 「optimization」 `omni release` 自动迭代版本号优化

### v2.3.2
1. 「optimization」 `omni init` 固定 `@omni-door/cli` 的中版本号

### v2.3.1
1. 「feat」支持 `spa-vue` 项目

### v2.3.0
1. 「optimization」`omni init`、`omni new` 新增脚手架 latest 版本的更新提示

2. 「upgrade」升级 @omni-door/utils，并替换 API

## v2.2.x
### v2.2.13
1. 「fix」`omni dev` favicon.icon 不存在的导致开发服务崩溃

### v2.2.12
1. 「upgrade」升级 @omni-door/utils

### v2.2.11
1. 「fix」`omni dev` 更改 `http-proxy-middleware` 的 API

### v2.2.10
1. 「fix」`omni init` toolkit 项目无法创建

### v2.2.9
1. 「fix」`omni dev` spa 项目 dev-server 通配符路由缺失

### v2.2.8
1. 「optimization」`omni init`、`omni new` 脚手架版本号和模板版本号同步

2. 「fix」`omni init` 包管理工具安装时的异常处理

### v2.2.7
1. 「optimization」`omni init` 新增对 REPL(命令行运行的交互式界面) 方式交互的包管理器校验

2. 「fix」`omni init` 当未选择样式文件时，正确的展示后续内容

### v2.2.6
1. 「optimization」npm-package latest 版本校验不阻塞程序运行

### v2.2.5
1. 「fix」`omni init` 对 `layout` 的值做转换

### v2.2.4
1. 「feat」`omni init` spa-react 项目支持 `layout` 选项

### v2.2.3
1. 「feat」spa-react 项目支持 webpack5

2. 「feat」spa-react 项目开发服务支持自定义 favicon

### v2.2.2
1. 「feat」`omni init` 模板的 pkj-tool 默认使用 pnpm

### v2.2.1
1. 「fix」`omni init` 项目名校验的问题

### v2.2.0
1. 「feat」`omni init` 安装工具新增 pnpm 选项，并移除 cnpm

2. 「feat」`omni init` 新增项目名规范校验

3. 「feat」新增 *最新版本 cli 安装提示*

4. 「feat」新增 *错误命令意图推测*

## v2.1.x
### v2.1.6
1. 「fix」`omni release` 自动构建参数缺失的问题.

### v2.1.5
1. 「feat」`omni release` 支持 自动构建(autoBuild).

### v2.1.4
1. 「fix」`omni build` toolkit 项目错误的从 'undefined' 或 'null' 中进行解构.

### v2.1.3
1. 「update」`omni build` toolkit 项目构建产物过滤掉忽略的文件夹

### v2.1.2
1. 「update」`omni build` 升级 toolkit 项目的 rollup 配置

### v2.1.1
1. 「fix」`omni release` 手动迭代版本号无法正确匹配

### v2.1.0
1. 「optimization」`omni build` 用 tsc 或 gulp 编译的项目，默认支持 alias

2. 「fix」`omni build` 自动安装缺少的构建依赖不全的问题

---

## v2.0.x
### v2.0.17
1. 「fix」`omni build` 组件项目gulp配置文件bug

### v2.0.16
1. 「fix」`omni build` 组件项目不兼容同时存在 scss less 文件的问题

### v2.0.15
1. 「optimization」`omni init` 模板的版本自动对齐脚手架的版本

### v2.0.14
1. 「optimization」优化 `omni init/release` 的日志输出

### v2.0.13
1. 「optimization」调用`omni *(commands)` 的日志输出

### v2.0.12
1. 「fix」`omni release` 因为 cache 导致获取当前版本号不正确的问题

### v2.0.11
1. 「fix」`omni release` 在命令行中自定义版本号，自动设置 `tag` 的优先级问题，如在 package.json 中原来的版本号为 `0.0.19`，而后用命令行迭代 `omni release -m 0.0.20-alpha.1`，此时自动判断 `tag` 应为 `alpha` 而非 `latest`

2. 「optimization」`omni release` publish 到 npm 仓库的日志优化

### v2.0.10
1. 「optimization」<omni.config.js> `release` 新增 `autoTag` 字段，设置为 `true` 时，发布到npm仓库时会自动根据当前版本号设定tag

### v2.0.9
1. 「optimization」`omni release` 自定义版本号会自动根据含带的字母确定默认的 tag

### v2.0.8
1. 「fix」`omni release` 自定义版本号因正则匹配失效的问题

2. 「optimization」`omni release` 默认 tag 取自现版本号的字母后缀

### v2.0.7
1. 「fix」`omni build` rollup.config.js namedExports 补全 react 和 react-dom 的 API

### v2.0.6
1. 「fix」`omni start` 依赖引用的问题

### v2.0.5
1. 「fix」`omni dev` 对于 react-ssr 项目的错误判断

### v2.0.4
1. 「feat」`omni *` 所有命令均支持 `-P <path>` 选项用于自定义工作路径

### v2.0.3
1. 「update」[newTpl、initial] 支持 `tplPkjTag` 选项

### v2.0.2
1. 「fix」修复 express typescript 的问题，[点击详见issue](https://github.com/DefinitelyTyped/DefinitelyTyped/issues/47339#issuecomment-691800846)

2. 「docs」变更日志优化

### v2.0.1
1. 「fix」`omni dev` 修复 ssr-react 项目无法启动的问题

### v2.0.0
1. 「feat」`omni init` 支持 ssr-react 项目类型

2. 「optimization」`omni init` 优化

3. 「feat」新增 `omni start` 命令

---

## v1.4.x
### v1.4.4
1. 「optimization」 `omni init` 固定 template 的版本号

### v1.4.3
1. 「feat」 `omni init` 支持 `tplPkjTag` 选项

### v1.4.2
1. 「perf」`omni release` 优化了 require package.json 的过程
    
2. 「chore」升级 @omni-door/utils

### v1.4.1
1. 「chore」固定依赖的版本号

2. 「fix」`omni build` typescript 被禁用的情况处理

### v1.4.0
1. 「feat」`omni dev` 开发服务支持 `https` 的协议

## v1.3.x
### v1.3.9
1. 「update」`omni dev` 开发服务 host 默认更变为 `0.0.0.0`

### v1.3.8
1. 「update」`omni build` 的 reserve.assets 字段的类型更变为: `(string | { srcPath: string; relativePath?: string; })[]`

### v1.3.7
1. 「docs」`omni release` 文本调整

2. 「optimization」`omni build` gulp 打包优化

### v1.3.6
1. 「fix」升级 @omni-door/utils，解决 logTime 前缀不正确的问题

### v1.3.5
1. 「feat」`omni release` 新增 -a / --automatic 选项，并支持REPL(read-eval-print loop)

### v1.3.4
1. 「feat」`omni dev` storybook 启动开发服务添加 --quiet 选项

2. 「feat」`omni dev` 支持 host 配置

### v1.3.3
1. 「chore」`omni dev` 整合 toolkit 和 component-library 项目的开发服务

### v1.3.2
1. 「chore」`omni build` 固定 gulp 构建的 cwd 路径 同时支持 component-libaray 输出全量的css

### v1.3.1
1. 「feat」`omni build` 支持使用 gulp 来打包组件库项目

2. 「chore」升级 @omni-door/utils

3. 「fix」`omni new [name]` 的 name 可能是 `undefined` 的问题

### v1.3.0
1. 「update」`omni dev -p <port> - port` 改为必填

2. 「update」`omni new [name] [option]` 的 name 改为选填，并支持REPL(read-eval-print loop)

## v1.2.x
### v1.2.38
1. 「fix」修复项目 package.json 可能不存在的问题

2. 「feat」`omni init` 新增支持 `pkjFieldName` 字段

### v1.2.37
1. 「feat」`omni build` 新增支持 `pkjFieldName` 字段

### v1.2.36
1. 「chore」升级 @omni-door/utils

2. 「feat」在 package.json 中支持 omni 字段，使之能够自定义配置文件(omni.config.js)的路径

### v1.2.35
1. 「feat」`omni new` 新增对传入的模块名做校验：

  - 模块名大于等于2个字符；

  - 第一个字符只能由 下划线_ 或 大小写字母 组成；

  - 后续字符只能由 数字、下划线_、大小写字母 组成！

### v1.2.34
1. 「feat」`omni initial` 支持 custom initPath

### v1.2.33
1. 「fix」`omni release` 删除会导致版本号不正确的缓存

### v1.2.32
1. 「fix」修复构建/发布完成后未退出程序的问题

### v1.2.31
1. 「fix」修复 `omni release` linux环境下版本无法迭代的问题

### v1.2.30
1. 「feat」`omni dev` proxy 支持传入 `function` 类型

### v1.2.29
1. 「feat」`omni dev` middleware 支持传入 `function` 类型

2. 「chore」升级 @omni-door/utils

### v1.2.28
1. 「update」<omni.config.js> `dev` 字段新增 `devMiddlewareOptions` 属性，对应 `webpack-dev-middleware` [Options](https://github.com/webpack/webpack-dev-middleware#options)

### v1.2.27
1. 「chore」依赖升级 commander@5.1.0

### v1.2.26
1. 「fix」commandar 自动输出 help 信息的逻辑

### v1.2.25
1. 「chore」依赖升级 commander@4.1.0

2. 「chore」`omni init` 提升参数 `tplPkjParams` 的权重

### v1.2.24
1. 「fix」依赖固定版本号

### v1.2.23
1. 「fix」修复重名文件夹的检测的问题

2. 「feat」`omni init` 项目重名支持重新输入，最大10次

### v1.2.22
1. 「feat」`omni init` 初始化时新增对重名文件夹的检测和覆盖确认提示

### v1.2.21
1. 「fix」初始化时选择 no-install 不会出现安装工具的选择

### v1.2.20
1. 「feat」`omni init` 新增初始化时不安装依赖的选项

### v1.2.19
1. 「chore」升级 @omni-door/utils

2. 「feat」plugin-new 回调参数新增 `模板来源(tplSource)` 字段

3. 「feat」plugin-build 回调参数新增 `自定义的构建配置(buildConfig)` 字段

4. 「feat」plugin-release 回调参数新增 `版本迭代策略(versionIterTactic)` 字段

### v1.2.18
1. 「fix」修复 logo 未被正确替换的问题

### v1.2.17
1. 「feat」`omni new` 移除组件名自动大写第一个字母的逻辑

2. 「chore」`omni build` toolkit 打包模板修改

3. 「fix」`omni release` 修复commitlint遗漏verify参数的问题

### v1.2.16
1. 「chore」升级 @omni-door/utils

2. 「chore」移除错误输出信息中多余的 `JSON.stringify`

3. 「update」为 `process` 绑定 `'SIGINT', 'SIGQUIT', 'SIGTERM'` 事件，监听退出程序

4. 「fix」`omni dev/build` 修复 `require` 无法获取工作路径的依赖的问题

### v1.2.15
1. 「update」优化异常操作处理

2. 「chore」@omni-door/utils 替换 @omni-door/tpl-utils

3. 「feat」`omni dev` 采用 create-react-app [复用已打开浏览器的tab策略](https://github.com/facebook/create-react-app/blob/32eebfeb7f5cdf93a790318eb76b81bb2927458e/packages/react-dev-utils/openChrome.applescript)

### v1.2.14
1. 「update」`omni build/release` 支持 prettier 飞行检查

2. 「update」`omni build` 新增对于自定义配置文件是否存在的校验

3. 「feat」`omni init` component-react项目新增 styleguidist Demo框架的选择

### v1.2.13
1. 「fix」`omni build` 当 catch[try/catch] 到错误时，停止 loading 状态

2. 「update」`omni init` 集成 prettier

### v1.2.12
1. 「feat」`omni build` 支持自定义配置文件路径

2. 「fix」`omni build` 修复输出资源是否存在的校验的bug

### v1.2.11
1. 「feat」`omni build` 支持 "hash"、"chunkhash"、"contenthash"

2. 「update」升级依赖 @omni-door/tpl-utils

### v1.2.10
1. 「feat」`omni initial` before 和 after 支持异步执行

2. 「feat」`omni new` 支持 before 和 after 回调

### v1.2.9
1. 「feat」`omni dev` 新增 Signals listener

2. 「update」升级依赖 @omni-door/tpl-utils

3. 「feat」`omni dev` 修复 history API 路由不正确的问题

### v1.2.8
1. 「update」插件新增 `options` 参数，并更新 type 定义

### v1.2.7
1. 「update」`omni release` 发布过程的异常处理逻辑更改

2. 「update」`omni release` 发布到npm仓库显示指定registry

3. 「update」`omni release` 发布到git仓库避免修改origin

4. 「feat」`omni release` 新增 tag 选项

5. 「update」插件运行新增try/catch异常处理

### v1.2.6
1. 「feat」[initial] 支持 `tplPkjParams` 选项

2. 「update」`omni build` 移除自动发布的时间日志

### v1.2.5
1. 「fix」`omni release` 修复版本检测的问题

### v1.2.4
1. 「fix」`omni release` 修复 分支检测和npm发布log前缀不正确的问题

2. 「update」升级 @omni-door/tpl-utils 依赖

### v1.2.3
1. 「docs」`omni release` 汉化翻译

2. 「update」升级 @omni-door/tpl-utils 依赖

3. 「feat」`omni initial/build/release)` 新增耗时日志输出

### v1.2.2
1. 「fix」`omni build` rollup 打包新增未正确发现入口文件的提示

2. 「feat」[newTpl、initial] 支持 `tplPkj` 选项

3. 「update」`omni new` 恢复 plugin 的支持

### v1.2.1
1. 「update」拆分模板
  - @omni-door/tpl-spa-react

  - @omni-door/tpl-toolkit

  - @omni-door/tpl-component-react

### v1.2.0
1. 「update」命名规范

## v1.1.x
### v1.1.3
1. 「update」<omni.config.js> 修复无法由于循环引用导致webpack配置文件无法获取正确值的问题

2. 「update」<webpack.config.prod.js> 新增 html-webpack-plugin

3. 「update」<webpack.config.dev.js> 将css、less、scss等样式文件的处理迁移至此

### v1.1.2
1. 「update」<omni.config.js> build 新增 hash 字段控制打包资源名是否添加哈希

2. 「docs」新增 omni.config.js 详解文档

### v1.1.1
1. 「update」<package.json> 修复函数的调用栈在转化成字符串后丢失，无法正确获取到变量值的问题

### v1.1.0
1. 「update」<package.json> 新增 resolutions 字段，解决 (依赖重复导致TS报错)[https://stackoverflow.com/questions/52399839/duplicate-identifier-librarymanagedattributes] 的问题

2. 「update」`onmi init` stable 策略版本更新

3. 「update」`onmi init` component-react 和 toolkit 默认开启单元测试

---

## v1.0.x
### v1.0.10
1. 「fix」[node-version-check] 修复node版本检测问题

2. 「feat」`onmi init` 动态更新初始化总步数

3. 「fix」`onmi build` 修复错误日志丢失的问题

4. 「fix」`onmi release` 修复错误日志丢失的问题

### v1.0.9
1. 「update」<package.json> 新增 stylelint 检测启动参数 {--allow-empty-input}

2. 「update」<package.json> 新增 jest 单元测试启动参数 {--passWithNoTests}

3. 「update」<tsconfig.json> 移除 allowJs、experimentalDecorators 的注释，更新 {exclude} 字段

4. 「update」<webpack.config.prod.js> 新增 webpack-bundle-analyzer 插件

5. 「update」<.npmignore> 生成基于项目类型

6. 「update」`onmi init` 支持样式多选

### v1.0.8
1. 「fix」`omni init` 修复自定义Logo显示不正确问题

2. 「chore」`omni init` 支持移除内置的依赖项

### v1.0.7
1. 「update」<tsconfig.json> 模板新增对项目类型判断

2. 「update」<omni.config.js> 注释变更

3. 「update」<webpack.config.prod.js> 优化生产环境打包

4. 「update」[dev-server] 新增运行时错误捕获

5. 「fix」`omni new` 修复无法识别参数的问题

### v1.0.6
1. 「feat」新增对 node 版本做检测，要求 node >= 10.13.0

### v1.0.5
1. 「update」<omni.config.js>, 新增 `dev.middleware` 字段

2. 「update」<omni.config.js>, 新增 `dev.logLevel` 字段

3. 「update」<omni.config.js>, `dev.webpack_config` 更变为 `dev.webpack`

### v1.0.4
1. 「feat」[dev-server] 启动进程优化

2. 「feat」`omni init` 更改 `omni init -s` 和 `omni init --simple` 为 `omni init -b` 和 `omni init -basic`

### v1.0.3
1. 「optimization」`omni build` 自动发布优化，摆脱依赖npm script，直接调用release方法

### v1.0.2
1. 「feat」toolkit 项目支持使用 tsc 打包

### v1.0.1
1. 「chore」优化了log日志的输出

### v1.0.0
1. 「feat」新增 `omni dev` 命令以支持基于 Express + webpack-dev-server 的开发服务

---

## v0.2.x
1. 可用版本，请使用最新版本

## v0.1.x
1. 可用版本，请使用最新版本

## v0.0.x
1. 非正式版本，请使用最新版本

---

**标签的含义**：
- 「xxx」 - 类型

- \<xxx> - 模板

- [xxx] - 行为、特性、功能