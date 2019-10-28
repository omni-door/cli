# omni-door (The CLI Tool for set up standard JS prject)

[![NPM downloads](http://img.shields.io/npm/dm/omni-door.svg?style=flat-square)](https://www.npmjs.com/package/omni-door)
[![npm version](https://badge.fury.io/js/omni-door.svg)](https://badge.fury.io/js/omni-door)
[![Build Status](https://travis-ci.com/BobbyLH/omni-door.svg?branch=master)](https://travis-ci.com/BobbyLH/omni-door)
[![codecov](https://codecov.io/gh/BobbyLH/omni-door/branch/master/graph/badge.svg)](https://codecov.io/gh/BobbyLH/omni-door)
[![install size](https://packagephobia.now.sh/badge?p=omni-door)](https://packagephobia.now.sh/result?p=omni-door)
[![license](http://img.shields.io/npm/l/omni-door.svg)](https://github.com/BobbyLH/omni-door/blob/master/LICENSE)


## install
Several options to get up and running:

* Clone the repo: `git clone git@github.com:BobbyLH/omni-door.git`
* Install with [npm](https://www.npmjs.com/package/omni-door): `npm install omni-door -g`
* Install with [Yarn](https://yarnpkg.com/en/package/omni-door): `yarn global add omni-door`

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
omni init --t
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
  -s --simple      create a simple project
  -t --standard    create a standard project
  -e --entire      create a most versatile project
  -u --utils       create a utils library
  -c --components  create a component library
  -h, --help       output usage information
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

## omni test

### options
```sh
Usage: omni test [options]

test your project by unit test frame

Options:
  --snapshot  update test snapshot
  -h, --help  output usage information
```

## omni lint

### options
```sh
Usage: omni lint [options]

check your project by lint-tools

Options:
  --commit    commitlint check
  --style     stylelint check
  --fix       eslint and stylelint fix
  -h, --help  output usage information
```

## License

Copyright (c) 2019-2019 Bobby.li

Released under the MIT License