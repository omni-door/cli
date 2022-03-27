# CHANGE LOG

English | [简体中文](./CHANGELOG.zh-CN.md)

## v2.6.x
### v2.6.0
1. 「feat」support `spa-react-pc` project

## v2.5.x
### v2.5.8
1. 「optimization」`omni build` and `omni release` log output improved.

### v2.5.7
1. 「update」upgrade *shelljs* to resolve circular dependency warning

### v2.5.6
1. 「fix」 `omni build` *.vue* file extension conversion when package with gulp

2. 「update」 `omni build` dependencies_build version upgrade

3. 「optimization」 `omni release` autoTag `rc` force to `latest` when extract from version

### v2.5.5
1. 「optimization」 `omni build` gulp-package custom configuration expose full items

### v2.5.4
1. 「optimization」 `omni build` gulp-package support custom configuration

### v2.5.3
1. 「fix」 `omni build` gulp-package replace vue-SFC file path

### v2.5.2
1. 「optimization」 `omni build` package with gulp will compile the vue-SFC file

### v2.5.1
1. 「optimization」 `omni build` gulp-package support vue SFC

2. 「feat」 `omni new` support SFC and Render-Function for *component-vue* project

### v2.5.0
1. 「feat」 `omni build` gulp-package support css path concat and replace css-minifier

## v2.4.x
### v2.4.9
1. 「update」 `omni release` put plugin process before git and npm process

### v2.4.8
1. 「optimization」 `omni release` tag and plugin handler

2. 「upgrade」upgrade @omni-door/utils

### v2.4.7
1. 「optimization」 `omni init` check the node version whether `>=12` when choose the *docz* for the demo-frame at *component-react* project

### v2.4.6
1. 「chore」 `omni new` name hint

2. 「optimization」 `omni dev` open browser after detect the port is occupied

### v2.4.5
1. 「optimization」 `omni release` git process will check status first

### v2.4.4
1. 「update」 `omni dev` open browser delay

### v2.4.3
1. 「optimization」 `omni release` npm publish support OTP

### v2.4.2
1. 「optimization」 `omni build` pass params to the rollup custom config

### v2.4.1
1. 「fix」 `omni init` the work path for overwrite

### v2.4.0
1. 「optimization」 the hint for upgrade cli

2. 「feat」support `component-vue` project

## v2.3.x

### v2.3.11
1. 「fix」 regular expression for version match

### v2.3.10
1. 「optimization」 log output

2. 「fix」`omni build` cannot delete the file or dir which outside the current working directory

### v2.3.9
1. 「optimization」 log output

### v2.3.8
1. 「optimization」 log output

### v2.3.7
1. 「optimization」 `omni release` iteration optimize

### v2.3.6
1. 「fix」 `omni build` the typescript-plugin will affect the rollup build result

### v2.3.5
1. 「fix」 `omni release` the auto-iteration tag problem

### v2.3.4
1. 「optimization」 `omni release` the optimization that auto-iteration strategy order

### v2.3.3
1. 「optimization」 `omni init` unit-test default-none-selected when the project is `spa-vue` 

2. 「optimization」 `omni release` auto-iteration optimization

### v2.3.2
1. 「optimization」 `omni init` fixed `@omni-door/cli` mid version

### v2.3.1
1. 「feat」support `spa-vue` project

### v2.3.0
1. 「optimization」`omni init`、`omni new` add cli latest version update-notification

2. 「upgrade」upgrade @omni-door/utils and replace APIs

## v2.2.x
### v2.2.13
1. 「fix」`omni dev` the dev-server crash because favicon.icon not exist

### v2.2.12
1. 「upgrade」upgrade @omni-door/utils

### v2.2.11
1. 「fix」`omni dev` change the `http-proxy-middleware`'s API

### v2.2.10
1. 「fix」`omni init` cannot init toolkit project

### v2.2.9
1. 「fix」`omni dev` the spa project dev-server wildcard route

### v2.2.8
1. 「optimization」`omni init`, `omni new` make sure then cli's version and templates' version consistence

2. 「fix」`omni init` install package manage tool exception handles

### v2.2.7
1. 「optimization」`omni init` add package management checking when in REPL style

2. 「fix」`omni init` correct display content when not select any stylesheet

### v2.2.6
1. 「optimization」npm-package latest version checking not block the program

### v2.2.5
1. 「fix」`omni init` the `layout` value need transform

### v2.2.4
1. 「feat」`omni init` spa-react project support `layout` option

### v2.2.3
1. 「feat」spa-react project support webpack5

2. 「feat」spa-react project dev-server support custom favicon

### v2.2.2
1. 「feat」`omni init` the template pkj-tool default use pnpm

### v2.2.1
1. 「fix」`omni init` the package name verify problem

### v2.2.0
1. 「feat」`omni init` install tool add pnpm option and remove cnpm

2. 「feat」`omni init` add package name verify

3. 「feat」add latest cli recommand hint

4. 「feat」add wrong command intention infer

## v2.1.x
### v2.1.6
1. 「fix」`omni release` auto build missing some parameters.

### v2.1.5
1. 「feat」`omni release` support auto build(autoBuild).

### v2.1.4
1. 「fix」`omni build` toolkit project destructure property 'undefined' or 'null' error.

### v2.1.3
1. 「update」`omni build` filter out the ingored folders when build the toolkit project

### v2.1.2
1. 「update」`omni build` upgrade the rollup-config which has been used for toolkit project

### v2.1.1
1. 「fix」`omni release` manual iterate version cannot match correct

### v2.1.0
1. 「optimization」`omni build` default support alias when use the tsc or gulp to build project

2. 「fix」`omni build` auto install build dependecies unsatisfied

---

## v2.0.x
### v2.0.17
1. 「fix」`omni build` the bug of component-project gulp configuration file

### v2.0.16
1. 「fix」`omni build` the component-project exsit both scss and less file not compatible

### v2.0.15
1. 「optimization」`omni init` template version will auto match the cli version

### v2.0.14
1. 「optimization」`omni init/release` log output

### v2.0.13
1. 「optimization」`omni *(commands)` log output

### v2.0.12
1. 「fix」`omni release` the cache problem which cause the current version is incorrect

### v2.0.11
1. 「fix」`omni release` customize the version in the command line, and the priority of auto set the `tag`. For example, in the package.json the version is `0.0.19` and then use the command line to iterate `omni release -m 0.0.20-alpha.1`. At this time, it should automatically determined that `tag` is `alpha` instead of `latest`

2. 「optimization」log opt for `omni release` publish to npm-repo

### v2.0.10
1. 「optimization」<omni.config.js> `release` add `autoTag` field which can automatically set tag according to the current version when it be setted to `true`

### v2.0.9
1. 「optimization」`omni release` custom version number will automatically determine then default tag

### v2.0.8
1. 「fix」`omni release` custom version number will invaild due to RegExp matching bug

2. 「optimization」`omni release` default tag now is taken from the letter suffix of the current version

### v2.0.7
1. 「fix」`omni build` rollup.config.js namedExports completion react and react-dom's API

### v2.0.6
1. 「fix」`omni start` refer to dependencies bug

### v2.0.5
1. 「fix」`omni dev` wrong judgement with react-ssr project

### v2.0.4
1. 「feat」`omni *` all commands is support `-P <path>` option which be used for specify workpath

### v2.0.3
1. 「update」[newTpl、initial] support `tplPkjTag` option

### v2.0.2
1. 「fix」fix express typescript problem, [more detail in this issue](https://github.com/DefinitelyTyped/DefinitelyTyped/issues/47339#issuecomment-691800846)

2. 「docs」CHANGELOG optimization

### v2.0.1
1. 「fix」`omni dev` fix ssr-react project cannot start bug

### v2.0.0
1. 「feat」`omni init` support ssr-react project

2. 「optimization」`omni init` optimize

3. 「feat」`omni start` add `start` command

---

## v1.4.x
### v1.4.4
1. 「optimization」 `omni init` fixed template version

### v1.4.3
1. 「feat」 `omni init` support tplPkjTag option

### v1.4.2
1. 「perf」`omni release`: the optimization for require package.json module
    
2. 「chore」upgrade @omni-door/utils

### v1.4.1
1. 「chore」fixed dependencies version

2. 「fix」`omni build`: typescript had been forbidden situation tackle

### v1.4.0
1. 「feat」`omni dev` support `https` protocol for dev-server

## v1.3.x
### v1.3.9
1. 「update」`omni dev` The default dev-server host change to `0.0.0.0`

### v1.3.8
1. 「update」`omni build` The reserve.assets field type change to: `(string | { srcPath: string; relativePath?: string; })[]`

### v1.3.7
1. 「docs」`omni release` text adjustment

2. 「optimization」`omni build` gulp-build optimization

### v1.3.6
1. 「fix」upgrade @omni-door/utils to resolve logTime prefix bug

### v1.3.5
1. 「feat」`omni release` add -a/--automatic options and support REPL(read-eval-print loop)

### v1.3.4
1. 「feat」`omni dev` storybook dev server start add --quiet option

2. 「feat」`omni dev` support custom host

### v1.3.3
1. 「chore」`omni dev` integration toolkit and component-library project dev server

### v1.3.2
1. 「chore」`omni build` fixed gulp-build cwd path and support component-libaray total output css

### v1.3.1
1. 「feat」`omni build` support gulp to build component-libaray project

2. 「chore」upgrade @omni-door/utils

3. 「fix」`omni new [name]` - name maybe undefined

### v1.3.0
1. 「update」`omni dev -p <port>` - port change to required option

2. 「update」`omni new [name] [option]` - name change to optional and support REPL(read-eval-print loop)

## v1.2.x
### v1.2.38
1. 「fix」the project package.json maybe non-exist situation

2. 「feat」`omni init` support pkjFieldName field

### v1.2.37
1. 「feat」`omni build` support pkjFieldName field

### v1.2.36
1. 「chore」upgrade @omni-door/utils

2. 「feat」support omni field in package.json which can specify config-path(omni.config.js)

### v1.2.35
1. 「feat」`omni new` add check for module name:

    - module name must greater-or-equal 2;

    - the first character can only be underscore or upper/lower case letter;

    - subsequent characters can only be numberm, underscore, upper and lower case letter!

### v1.2.34
1. 「feat」[initial] support custom `initPath`

### v1.2.33
1. 「fix」`omni release` delete cache to avoid version incorrect

### v1.2.32
1. 「fix」the process not exit when build/release have been finished

### v1.2.31
1. 「fix」`omni release` fix the version cannot iterate when run in linux env

### v1.2.30
1. 「feat」`omni dev` proxy support pass `function` type

### v1.2.29
1. 「feat」`omni dev` middleware support pass `function` type

2. 「chore」upgrade @omni-door/utils

### v1.2.28
1. 「update」<omni.config.js> `dev` field add `devMiddlewareOptions` property which match to `webpack-dev-middleware` [Options](https://github.com/webpack/webpack-dev-middleware#options)

### v1.2.27
1. 「chore」dependency upgrade commander@5.1.0

### v1.2.26
1. 「fix」remove commandar auto output help information

### v1.2.25
1. 「chore」dependency upgrade commander@4.1.0

2. 「fix」`omni init` increase the weight of parameter `tplPkjParams`

### v1.2.24
1. 「fix」the dependencies fixed version

### v1.2.23
1. 「fix」detection duplicate directory bug

2. 「feat」`omni init` name duplicate support retry up to 10 times

### v1.2.22
1. 「feat」`omni init` add detection and confirmation prompt for duplicate directory when initialization

### v1.2.21
1. 「fix」initialization will not ask install tool when choose no-install

### v1.2.20
1. 「feat」`omni init` add without install any dependencies when init project

### v1.2.19
1. 「chore」upgrade @omni-door/utils

2. 「feat」plugin-new callback arguments add `template-source(tplSource)` field

3. 「feat」plugin-build callback arguments add `custom-build-configuration(buildConfig)` field

4. 「feat」plugin-release callback arguments add `version-iteration-tactic(versionIterTactic)` field

### v1.2.18
1. 「fix」the logo doesn't replace correctly

### v1.2.17
1. 「feat」`omni new` remove the logic which automatic transform to uppercase for the component-name's fist letter

2. 「chore」`omni build` tookit package template modify

3. 「fix」`omni release` fix the commitlint omit verify arguments bug

### v1.2.16
1. 「chore」upgrade @omni-door/utils

2. 「chore」remove redundant `JSON.stringify` in the error-log output

3. 「update」`process` bind `'SIGINT', 'SIGQUIT', 'SIGTERM'` event to monitor exit

4. 「fix」`omni dev/build` fix the `require` cannot obtain cwd path problem

### v1.2.15
1. 「update」optimization exception

2. 「chore」@omni-door/utils is replace to @omni-door/tpl-utils

3. 「feat」(omni dev) apply create-react-app [Re-use current tab](https://github.com/facebook/create-react-app/blob/32eebfeb7f5cdf93a790318eb76b81bb2927458e/packages/react-dev-utils/openChrome.applescript)

### v1.2.14
1. 「update」`omni build/release` support prettier preflight check

2. 「update」`omni build` checking exist about the specify config file

3. 「feat」`omni init` component-react project add styleguidist demo-framework

### v1.2.13
1. 「fix」`omni build` stopping loading state when catch error

2. 「update」`omni init` integrate prettier

### v1.2.12
1. 「feat」`omni build` support specify the path of config file

2. 「fix」`omni build` the checking of output-result bug fixed

### v1.2.11
1. 「feat」`omni build` support "hash", "chunkhash" and "contenthash"

2. 「update」upgrade the @omni-door/tpl-utils dependency

### v1.2.10
1. 「feat」[initial] before and after support asynchronous execution

2. 「feat」[newTpl] support before and after callbacks

### v1.2.9
1. 「feat」`omni dev` add Signals listener

2. 「update」upgrade the @omni-door/tpl-utils dependency

3. 「feat」`omni dev` fix the history API incorrect router problem

### v1.2.8
1. 「update」add `options` arguments for plugin and update the type defination

### v1.2.7
1. 「update」`omni release` The exception handle logic change

2. 「update」`omni release` Explicit sticking npm registry address

3. 「update」`omni release` Publish to git repositor without modify remote origin

5. 「feat」`omni release` Adding tag option

4. 「update」Adding try/catch handle when exec plugin

### v1.2.6
1. 「feat」[initial] support `tplPkjParams` option

2. 「update」`omni build` remove auto-release time log

### v1.2.5
1. 「fix」`omni release` version-check bug fixed

### v1.2.4
1. 「fix」`omni release` branch-check and npm-publish log prefix fixed

2. 「fix」upgrade @omni-door/tpl-utils dependency

### v1.2.3
1. 「docs」(omni release) Chinese Translation

2. 「update」upgrade @omni-door/tpl-utils dependency

3. 「feat」`omni initial/build/release` add time log

### v1.2.2
1. 「fix」`omni build` add not found the entry file hint when process rollup-build

2. 「feat」[newTpl initial] support `tplPkj` option

3. 「update」`omni new` restore plugin

### v1.2.1
1. 「update」split templates
  - @omni-door/tpl-spa-react

  - @omni-door/tpl-toolkit

  - @omni-door/tpl-component-react

### v1.2.0
1. 「update」naming conventions

## v1.1.x
### v1.1.3
1. 「update」<omni.config.js> fix webpack configuration file cannot get correct value due to circular references problem

2. 「update」<webpack.config.prod.js> add html-webpack-plugin

3. 「update」<webpack.config.dev.js> migrate into css, less and scss stylesheet procession

### v1.1.2
1. 「update」<omni.config.js> add hash field for control whether add to hash-tag to building result

2. 「docs」add omni.config.js detail docs

### v1.1.1
1. 「update」<package.json> fix the call-stack will be lost when the function convert to string which will cause the variable become undefined

### v1.1.0
1. 「update」<package.json> add resolutions field, resolve (Duplicate identifier 'LibraryManagedAttributes')[https://stackoverflow.com/questions/52399839/duplicate-identifier-librarymanagedattributes] problem

2. 「update」`onmi init` strategy-stable update dependencies version

3. 「update」`onmi init` component-react and toolkit set unit-test by default

---

## v1.0.x
### v1.0.10
1. 「fix」[node-version-check] fix the version check bug

2. 「feat」(onmi init) dynamic update the total-step of initial project

3. 「fix」(onmi build) fix miss of error log problem

4. 「fix」(onmi release) fix miss of error log problem

### v1.0.9
1. 「update」<package.json> add stylelint check paramter {--allow-empty-input}

2. 「update」<package.json> add jest test paramter {--passWithNoTests}

3. 「update」<tsconfig.json> remove annotation of allowJs and experimentalDecorators, updating {exclude} field

4. 「update」<webpack.config.prod.js> add webpack-bundle-analyzer plugin

5. 「update」<.npmignore> generate by project-type

6. 「update」`onmi init` support multiple select stylesheet

### v1.0.8
1. 「fix」`omni init` fix incorrect display of custom logo

2. 「chore」`omni init` support remove origin dependencies

### v1.0.7
1. 「update」<tsconfig.json> template add project_type judgement

2. 「update」<omni.config.js> annotation change

3. 「update」<webpack.config.prod.js> optimize production environment packing

4. 「update」[dev-server] add run-time try/exception

5. 「fix」`omni new` fix cannot identify options bug

### v1.0.6
1. 「feat」pre-check node version，demand node >= 10.13.0

### v1.0.5
1. 「update」<omni.config.js>, add `dev.middleware` field

2. 「update」<omni.config.js>, add `dev.logLevel` field

3. 「update」<omni.config.js>, `dev.webpack_config` change to `dev.webpack`

### v1.0.4
1. 「feat」[dev-server] start process optimization

2. 「feat」`omni init` change `omni init -s` and `omni init --simple` to `omni init -b` and `omni init --basic`

### v1.0.3
1. 「optimization」`omni build` auto-release optimization, get rid of relying on NPM script and call release method directly

### v1.0.2
1. 「feat」toolkit-project support tsc build

### v1.0.1
1. 「chore」optimized log output

### v1.0.0
1. 「feat」add `omni dev` command that support the development server which powered by Express and webpack-dev-server

---

## v0.2.x
1. available version, please upgrade the latest version

## v0.1.x
1. available version, please upgrade the latest version

## v0.0.x
1. informal version, please upgrade the latest version

---

**The Meaning of Tags**：
- 「xxx」 - type

- \<xxx> - template

- [xxx] - behavior or feature or function