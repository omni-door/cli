# 🐸 @omni-door/cli
The CLI Tool for set up standard React project.

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

## omni --help
```sh
  Usage: index [options] [command]

  Options:

    -v, --version   output the version number
    -h, --help      output usage information

  Commands:

    init [options]          initialize your project
    new [options] [module]  omni new [module] [-f | -c]
    build                   build your project according to [omni.config.js]
    release [options]       publish your project according to [omni.config.js]
    test [options]          test your project by unit test frame
    lint [options]          check your project by lint-tools

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

#### options
```sh
Usage: omni init [options]

initialize your project

Options:
  -s --simple [name]      create a simple project
  -t --standard [name]    create a standard project
  -e --entire [name]      create a most versatile project
  -u --utils [name]       create a utils library
  -c --components [name]  create a component library
  -h, --help              output usage information
```

## omni new

### options
```sh
Usage: omni new [options] [module]

omni new [module] [-f | -c]

Options:
  -f, --fc    create a functional component
  -c, --cc    create a class component
  -h, --help  output usage information
```

## omni build

### Build your project according to [omni.config.js]
```sh
npm run build
```
or
```sh
omni build
```

## omni release

### options
```sh
Usage: omni release [options]

publish your project according to [omni.config.js]

Options:
  -i, --ignore            ignore automatic iteration version
  -m, --manual <version>  manual iteration version
  -h, --help              output usage information
```

## License

Copyright (c) 2019-2019 [Bobby.li](https://github.com/BobbyLH)

Released under the MIT License