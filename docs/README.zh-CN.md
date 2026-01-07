# 🐸 @omni-door/cli

https://www.omnidoor.org

一个用于创建标准前端项目并执行常用开发/构建/发布任务的 CLI。

[![NPM downloads](http://img.shields.io/npm/dm/%40omni-door%2Fcli.svg?style=flat-square)](https://www.npmjs.com/package/@omni-door/cli)
[![npm version](https://badge.fury.io/js/%40omni-door%2Fcli.svg)](https://badge.fury.io/js/%40omni-door%2Fcli)
[![node version](https://img.shields.io/badge/node.js-%3E=_10.13.0-green.svg?style=flat-square)](http://nodejs.org/download/)
[![Build Status](https://travis-ci.com/omni-door/cli.svg?branch=master)](https://travis-ci.com/omni-door/cli)
[![codecov](https://codecov.io/gh/omni-door/cli/branch/master/graph/badge.svg)](https://codecov.io/gh/omni-door/cli)
[![install size](https://packagephobia.now.sh/badge?p=%40omni-door%2Fcli)](https://packagephobia.now.sh/result?p=%40omni-door%2Fcli)
[![license](http://img.shields.io/npm/l/%40omni-door%2Fcli.svg)](https://github.com/omni-door/cli/blob/master/LICENSE)

[English](../README.md) | 简体中文

## 环境要求
- Node.js >= 10.13.0（推荐最新 LTS）

## 安装
- 克隆仓库：`git@github.com:omni-door/cli.git`
- npm：`npm install @omni-door/cli -g`
- Yarn：`yarn global add @omni-door/cli`
- npx（免安装）：`npx @omni-door/cli init`

## 快速开始
```shell
omni init
```

## 命令
完整参数请查看：`omni --help`。

- `omni init [strategy]` 创建项目（stable 或 latest）
- `omni dev` 启动开发服务
- `omni start` 启动生产服务
- `omni new [name]` 创建组件/模板
- `omni build` 基于 `omni.config.js` 构建项目
- `omni release` 基于 `omni.config.js` 发布项目

`dev`、`start`、`build` 支持 `--` 透传参数：
```shell
omni dev -- --webpack
omni start -- --hostname 0.0.0.0
omni build -- --webpack
```

## 配置说明
`omni.config.js` 详解： [docs/OMNI.zh-CN.md](./OMNI.zh-CN.md)

## 文档
- API/插件文档： [docs/DEV.zh-CN.md](./DEV.zh-CN.md)
- 变更日志： [docs/CHANGELOG.zh-CN.md](./CHANGELOG.zh-CN.md)

## License

Copyright (c) 2019 [Bobby.li](https://github.com/BobbyLH)

Released under the MIT License
