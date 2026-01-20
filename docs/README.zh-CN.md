# 🐸 @omni-door/cli

https://www.omnidoor.org

一个用于创建标准前端项目并执行常用开发/构建/发布任务的 CLI。

[![NPM downloads](http://img.shields.io/npm/dm/%40omni-door%2Fcli.svg?style=flat-square)](https://www.npmjs.com/package/@omni-door/cli)
[![npm version](https://badge.fury.io/js/%40omni-door%2Fcli.svg)](https://badge.fury.io/js/%40omni-door%2Fcli)
[![node version](https://img.shields.io/badge/node.js-%3E=_10.13.0-green.svg?style=flat-square)](http://nodejs.org/download/)
[![Build Status](https://travis-ci.com/omni-door/cli.svg?branch=master)](https://travis-ci.com/omni-door/cli)
[![codecov](https://codecov.io/gh/omni-door/cli/branch/master/graph/badge.svg)](https://codecov.io/gh/omni-door/cli)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![install size](https://packagephobia.now.sh/badge?p=%40omni-door%2Fcli)](https://packagephobia.now.sh/result?p=%40omni-door%2Fcli)
[![license](http://img.shields.io/npm/l/%40omni-door%2Fcli.svg)](https://github.com/omni-door/cli/blob/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/omni-door/cli?style=social)](https://github.com/omni-door/cli)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/omni-door/cli/pulls)

[English](../README.md) | 简体中文

## 为什么选择 omni-door？

**omni-door** 是一个全面的 CLI 工具，帮助你：

- **一键初始化** - 用一个命令创建生产就绪的项目
- **多框架支持** - 创建 React/Vue SPA、SSR 应用、组件库和工具库
- **统一工作流** - 所有项目类型使用一致的开发/构建/发布体验
- **插件系统** - 通过自定义插件扩展构建和发布阶段的功能
- **TypeScript 优先** - 开箱即用的完整 TypeScript 支持
- **最佳实践** - 预配置 ESLint、Prettier、Commitlint 和测试框架

## 特性

| 特性 | 描述 |
|------|------|
| 🚀 **快速开始** | 几分钟内初始化完整项目 |
| ⚛️ **React 支持** | SPA、SSR (Next.js) 和组件库 |
| 💚 **Vue 支持** | SPA 和组件库 |
| 📦 **工具库** | 轻松创建 SDK/工具库 |
| 🔧 **开发服务器** | 内置 Express 服务器，支持 HMR 和代理 |
| 🏗️ **构建工具** | 集成 Webpack、Rollup、Gulp 和 TSC |
| 📤 **发布** | 自动化版本管理、Git 标签和 npm 发布 |
| 🔌 **插件** | 可扩展架构，支持自定义工作流 |

## 与其他工具对比

| 功能 | omni-door | create-react-app | vue-cli | vite |
|------|:---------:|:----------------:|:-------:|:----:|
| React SPA | ✅ | ✅ | ❌ | ✅ |
| Vue SPA | ✅ | ❌ | ✅ | ✅ |
| React SSR | ✅ | ❌ | ❌ | 插件 |
| 组件库 | ✅ | ❌ | ❌ | ❌ |
| 工具库/SDK | ✅ | ❌ | ❌ | ❌ |
| 插件系统 | ✅ | ❌ | ✅ | ✅ |
| 统一发布 | ✅ | ❌ | ❌ | ❌ |
| 多构建工具 | ✅ | ❌ | ❌ | ❌ |

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

## 支持的项目类型

| 类型 | 描述 | 命令 |
|------|------|------|
| `spa-react` | React 单页应用 | `omni init -rb` |
| `spa-react-pc` | React 后台管理应用 (基于 Antd) | `omni init -rp` |
| `spa-vue` | Vue 单页应用 | `omni init -vb` |
| `ssr-react` | React 服务端渲染 | `omni init -rS` |
| `component-react` | React 组件库 | `omni init -rc` |
| `component-vue` | Vue 组件库 | `omni init -vc` |
| `toolkit` | SDK/工具库 | `omni init -t` |

## 配置说明
`omni.config.js` 详解：[docs/OMNI.zh-CN.md](./OMNI.zh-CN.md)

## 文档
- API/插件文档：[docs/DEV.zh-CN.md](./DEV.zh-CN.md)
- 变更日志：[docs/CHANGELOG.zh-CN.md](./CHANGELOG.zh-CN.md)

## 参与贡献

欢迎贡献！请查看我们的贡献指南了解详情。

## License

Copyright (c) 2019 [Bobby.li](https://github.com/BobbyLH)

Released under the MIT License
