# 🐸 @omni-door/cli

https://www.omnidoor.cn

一个能创建标准的 javascript 项目的脚手架。

[![NPM downloads](http://img.shields.io/npm/dm/%40omni-door%2Fcli.svg?style=flat-square)](https://www.npmjs.com/package/@omni-door/cli)
[![npm version](https://badge.fury.io/js/%40omni-door%2Fcli.svg)](https://badge.fury.io/js/%40omni-door%2Fcli)
[![node version](https://img.shields.io/badge/node.js-%3E=_10.13.0-green.svg?style=flat-square)](http://nodejs.org/download/)
[![Build Status](https://travis-ci.com/omni-door/cli.svg?branch=master)](https://travis-ci.com/omni-door/cli)
[![codecov](https://codecov.io/gh/omni-door/cli/branch/master/graph/badge.svg)](https://codecov.io/gh/omni-door/cli)
[![install size](https://packagephobia.now.sh/badge?p=%40omni-door%2Fcli)](https://packagephobia.now.sh/result?p=%40omni-door%2Fcli)
[![license](http://img.shields.io/npm/l/%40omni-door%2Fcli.svg)](https://github.com/omni-door/cli/blob/master/LICENSE)

[English](../README.md) | 简体中文

[<omni.config.js> 详解](./OMNI.zh-CN.md)

[变更日志](./CHANGELOG.zh-CN.md)

## 安装
推荐使用 node 最新的 LTS 版本，或至少保证 node >= 10.13.0

几个选项:

* 克隆仓库: `git@github.com:omni-door/cli.git`

* 用 [npm](https://www.npmjs.com/package/@omni-door/cli) 安装：`npm install @omni-door/cli -g`

* 用 [Yarn](https://yarnpkg.com/en/package/@omni-door/cli) 安装：`yarn global add @omni-door/cli`

* 直接用 [npx](https://www.npmjs.com/package/@omni-door/cli) 初始化你的项目：`npx @omni-door/cli init`

## omni --help
```shell
  Usage: index [command] [options]

  Options:

    -v, --version   输出版本号
    -h, --help      输出使用帮助

  Commands:

    init [strategy] [options]  初始化你的项目，[strategy(策略)] 可用是stable(默认) 或 lastst
    dev [options]              omni dev -p [port]
    new <module> [options]     omni new [module] [-f | -c]
    build                      根据 [omni.config.js] 打包构建你的项目
    release [options]          根据 [omni.config.js] 发布你的项目

```

## omni init

### 初始化一个项目
```shell
omni init
```

### 用最新的依赖@lastest初始化项目
```shell
omni init lastest
```

### 初始化项目但不安装依赖
```shell
omni init -n
```

### 套用模板一键初始化项目
```shell
omni init -t [projectName]
```
or
```shell
omni init --entire [projectName]
```

### 选项
```shell
Usage: omni init [strategy] [options]

initialize your project, [strategy] could be stable(default) or latest

Arguments:

  strategy                 stable or latest

Options:
  -rb, --react_basic [name]       创建一个最基本的 React 单页应用
  -rs, --react_standard [name]    创建一个标准的 React 单页应用
  -re, --react_entire [name]      创建一个全量的 React 单页应用
  -rS, --react_ssr [name]         创建一个 React SSR 应用
  -rc, --react_components [name]  创建一个 React 组件库
  -t, --toolkit [name]            创建一个工具库
  -n, --no-install         初始化项目不安装任何依赖
  -h, --help               output usage information
```

---

## omni dev

### 选项
```shell
Usage: omni dev [options]

omni dev -p <port>

Options:
  -p, --port <port>      根据指定的端口号启动开发服务
  -H, --hostname <host>  根据指定的hostname启动开发服务
  -h, --help             output usage information
```

---

## omni new

### 选项
```shell
Usage: omni new [name] [options]

omni new [name] [-f | -c]

Arguments:

  module           可选！组件名称。

Options:
  -f, --function    创建一个函数组件
  -c, --class       创建一个类组件
  -h, --help        output usage information
```

---

## omni build

### 选项
```shell
Usage: omni build [options]

build your project according to [omni.config.js]

Options:
  -c, --config <path>  指定构建的配置文件路径
  -n, --no-verify      绕过所有预检直接构建
  -h, --help           output usage information
```

---

## omni release

### 选项
```shell
Usage: omni release [options]

publish your project according to [omni.config.js]

Options:
  -a, --automatic         发布并自动迭代版本号
  -i, --ignore            发布并忽视版本号的迭代
  -m, --manual <version>  发布并手动指定版本号
  -t, --tag <tag>         发布时指定tag
  -n, --no-verify         绕过所有的预检直接发布
  -h, --help              output usage information
```

---

## omni start

### 选项
```shell
Usage: omni start [options]

omni start -p <port>

Options:
  -p, --port <port>      根据指定的端口号启动生产服务
  -H, --hostname <host>  根据指定的hostname启动生产服务
  -h, --help             output usage information
```

---

## API文档
点 [这里](./DEV.zh-CN.md)

## License

Copyright (c) 2019 [Bobby.li](https://github.com/BobbyLH)

Released under the MIT License