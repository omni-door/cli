# 🐸 @omni-door/cli
The CLI Tool for set up standard javascript project.

[![NPM downloads](http://img.shields.io/npm/dm/%40omni-door%2Fcli.svg?style=flat-square)](https://www.npmjs.com/package/@omni-door/cli)
[![npm version](https://badge.fury.io/js/%40omni-door%2Fcli.svg)](https://badge.fury.io/js/%40omni-door%2Fcli)
[![Build Status](https://travis-ci.com/omni-door/cli.svg?branch=master)](https://travis-ci.com/omni-door/cli)
[![codecov](https://codecov.io/gh/omni-door/cli/branch/master/graph/badge.svg)](https://codecov.io/gh/omni-door/cli)
[![install size](https://packagephobia.now.sh/badge?p=%40omni-door%2Fcli)](https://packagephobia.now.sh/result?p=%40omni-door%2Fcli)
[![license](http://img.shields.io/npm/l/%40omni-door%2Fcli.svg)](https://github.com/omni-door/cli/blob/master/LICENSE)


## install
Several options to get up and running:

* Clone the repo: `git@github.com:omni-door/cli.git`
* Install with [npm](https://www.npmjs.com/package/@omni-door/cli): `npm install @omni-door/cli -g`
* Install with [Yarn](https://yarnpkg.com/en/package/@omni-door/cli): `yarn global add @omni-door/cli`
* Initial project with [npx](https://www.npmjs.com/package/@omni-door/cli): `npx @omni-door/cli init`

## omni --help
```sh
  Usage: index [command] [options]

  Options:

    -v, --version   output the version number
    -h, --help      output usage information

  Commands:

    init [strategy] [options]  initialize your project, [strategy] could be stable(default) or latest
    dev [options]              omni dev -p [port]
    new <module> [options]     omni new [module] [-f | -c]
    build                      build your project according to [omni.config.js]
    release [options]          publish your project according to [omni.config.js]

```

## omni init

### Initial your project by answer several questions
```sh
omni init
```

### Initial your project according to some template
```sh
omni init -t
```
or
```sh
omni init --entire
```

### options
```sh
Usage: omni init [strategy] [options]

initialize your project, [strategy] could be stable(default) or latest

Arguments:

  strategy                 stable or latest

Options:
  -s, --simple [name]     create a simple React SPA project
  -d, --standard [name]   create a standard  React SPA project
  -e, --entire [name]      create a most versatile  React SPA project
  -t, --toolkit [name]     create a toolkit project
  -c, --components [name]  create a React component library
  -h, --help               output usage information
```

---

## omni dev

### options
```sh
Usage: omni dev [options]

omni dev -p [port]

Options:
  -p, --port [port]  create a simple React SPA project
  -h, --help         output usage information
```

---

## omni new

### options
```sh
Usage: omni new <module> [options]

omni new <module> [-fc | -cc]

Arguments:

  module           required! The first letter will be capitalizing.

Options:
  -f, --fc    create a functional component
  -c, --cc    create a class component
  -h, --help  output usage information
```

---

## omni build

### options
```sh
Usage: omni build [options]

build your project according to [omni.config.js]

Options:
  -n, --no-verify  bypass all pre-check before building
  -h, --help       output usage information
```

---

## omni release

### options
```sh
Usage: omni release [options]

publish your project according to [omni.config.js]

Options:
  -i, --ignore            ignore automatic iteration version
  -m, --manual <version>  manual iteration version
  -n, --no-verify         bypass unit-test eslint and stylelint check
  -h, --help              output usage information
```

---

## Accessible Docs
click [here](./docs/DEV.md)

## License

Copyright (c) 2019 [Bobby.li](https://github.com/BobbyLH)

Released under the MIT License