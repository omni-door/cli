# 🐸 @omni-door/cli

https://www.omnidoor.org

A CLI for scaffolding standard frontend projects and running common dev/build/release tasks.

[![NPM downloads](http://img.shields.io/npm/dm/%40omni-door%2Fcli.svg?style=flat-square)](https://www.npmjs.com/package/@omni-door/cli)
[![npm version](https://badge.fury.io/js/%40omni-door%2Fcli.svg)](https://badge.fury.io/js/%40omni-door%2Fcli)
[![node version](https://img.shields.io/badge/node.js-%3E=_10.13.0-green.svg?style=flat-square)](http://nodejs.org/download/)
[![Build Status](https://travis-ci.com/omni-door/cli.svg?branch=master)](https://travis-ci.com/omni-door/cli)
[![codecov](https://codecov.io/gh/omni-door/cli/branch/master/graph/badge.svg)](https://codecov.io/gh/omni-door/cli)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![install size](https://packagephobia.now.sh/badge?p=%40omni-door%2Fcli)](https://packagephobia.now.sh/result?p=%40omni-door%2Fcli)
[![license](http://img.shields.io/npm/l/%40omni-door%2Fcli.svg)](https://github.com/omni-door/cli/blob/master/LICENSE)

<img src='./docs/omni-init.gif' width='800px' height='500px' />

English | [简体中文](./docs/README.zh-CN.md)

## Requirements
- Node.js >= 10.13.0 (latest LTS recommended)

## Installation
- Clone: `git@github.com:omni-door/cli.git`
- npm: `npm install @omni-door/cli -g`
- Yarn: `yarn global add @omni-door/cli`
- npx (no install): `npx @omni-door/cli init`

## Quick Start
```shell
omni init
```

## Commands
Run `omni --help` for the full option list.

- `omni init [strategy]` scaffold a project (stable or latest)
- `omni dev` start the development server
- `omni start` start the production server
- `omni new [name]` create a component/template
- `omni build` build the project based on `omni.config.js`
- `omni release` publish the project based on `omni.config.js`

Pass-through args are supported for `dev`, `start`, and `build`:
```shell
omni dev -- --webpack
omni start -- --hostname 0.0.0.0
omni build -- --webpack
```

## Configuration
See the `omni.config.js` reference: [docs/OMNI.md](./docs/OMNI.md)

## Docs
- API/Plugin docs: [docs/DEV.md](./docs/DEV.md)
- Changelog: [docs/CHANGELOG.md](./docs/CHANGELOG.md)

## License

Copyright (c) 2019 [Bobby.li](https://github.com/BobbyLH)

Released under the MIT License
