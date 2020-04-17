# CHANGE LOG

## v1.2.x
### v1.2.19
1. upgrade @omni-door/utils

### v1.2.18
1. [fix bug] the logo doesn't replace correctly

### v1.2.17
1. (omni new) remove the logic which automatic transform to uppercase for the component-name's fist letter

2. (omni build) tookit package template modify

3. (omni release) fix the commitlint omit verify parameters bug

### v1.2.16
1. upgrade @omni-door/utils

2. remove redundant `JSON.stringify` in the error-log output

3. `process` bind `'SIGINT', 'SIGQUIT', 'SIGTERM'` event to monitor exit

4. (omni dev/build) fix the `require` cannot obtain cwd path problem

### v1.2.15
1. optimization exception

2. @omni-door/utils is replace to @omni-door/tpl-utils

3. (omni dev) apply create-react-app (Re-use current tab)[https://github.com/facebook/create-react-app/blob/32eebfeb7f5cdf93a790318eb76b81bb2927458e/packages/react-dev-utils/openChrome.applescript]

### v1.2.14
1. (omni build/release) support prettier preflight check

2. (omni build) checking exist about the specify config file

3. (omni init) component-library-react project add styleguidist demo-framework

### v1.2.13
1. (omni build) stopping loading state when catch error

2. (omni init) integrate prettier

### v1.2.12
1. (omni build) support specify the path of config file

2. (omni build) the checking of output-result bug fixed

### v1.2.11
1. (omni build) support "hash", "chunkhash" and "contenthash"

2. upgrade the @omni-door/tpl-utils dependency

### v1.2.10
1. [initial] before and after support asynchronous execution

2. [newTpl] support before and after callbacks

### v1.2.9
1. (omni dev) add Signals listener

2. upgrade the @omni-door/tpl-utils dependency

3. (omni dev) fix the history API incorrect router problem

### v1.2.8
1. add `options` parameters for plugin and update the type defination

### v1.2.7
1. (omni release) The exception handle logic change

2. (omni release) Explicit sticking npm registry address

3. (omni release) Publish to git repositor without modify remote origin

5. (omni release) Adding tag option

4. Adding try/catch handle when exec plugin

### v1.2.6
1. [initial] support tplPkjParams option

2. (omni build) remove auto-release time log

### v1.2.5
1. (omni release) version-check bug fixed

### v1.2.4
1. (omni release) branch-check and npm-publish log prefix fixed

2. upgrade @omni-door/tpl-utils dependency

### v1.2.3
1. (omni release) Chinese Translation

2. upgrade @omni-door/tpl-utils dependency

3. (omni initial/build/release) add time log

### v1.2.2
1. (omni build) add not found the entry file hint when process rollup-build

2. [newTpl initial] support tplPkj option

3. (omni new) restore plugin

### v1.2.1
1. split templates
  - @omni-door/tpl-spa-react

  - @omni-door/tpl-toolkit

  - @omni-door/tpl-component-library-react

### v1.2.0
1. naming conventions

## v1.1.x
### v1.1.3
1. <omni.config.js> fix webpack configuration file cannot get correct value due to circular references problem

2. <webpack.config.prod.js> add html-webpack-plugin

3. <webpack.config.dev.js> migrate into css, less and scss stylesheet procession

### v1.1.2
1. <omni.config.js> add hash field for control whether add to hash-tag to building result

2. add omni.config.js detail docs

### v1.1.1
1. <package.json> fix the call-stack will be lost when the function convert to string which will cause the variable become undefined

### v1.1.0
1. <package.json> add resolutions field, resolve (Duplicate identifier 'LibraryManagedAttributes')[https://stackoverflow.com/questions/52399839/duplicate-identifier-librarymanagedattributes] problem

2. (onmi init) strategy-stable update dependencies version

3. (onmi init) component-library-react and toolkit set unit-test by default

---

## v1.0.x
### v1.0.10
1. [node-version-check] fix the version check bug

2. (onmi init) dynamic update the total-step of initial project

3. (onmi build) fix miss of error log problem

4. (onmi release) fix miss of error log problem

### v1.0.9
1. <package.json> add stylelint check paramter {--allow-empty-input}

2. <package.json> add jest test paramter {--passWithNoTests}

3. <tsconfig.json> remove annotation of allowJs and experimentalDecorators, updating {exclude} field

4. <webpack.config.prod.js> add webpack-bundle-analyzer plugin

5. <.npmignore> generate by project-type

6. (onmi init) support multiple select stylesheet

### v1.0.8
1. (omni init) fix incorrect display of custom logo

2. (omni init) support remove origin dependencies

### v1.0.7
1. <tsconfig.json> template add project_type judgement

2. <omni.config.js> annotation change

3. <webpack.config.prod.js> optimize production environment packing

4. [dev-server] add run-time try/exception

5. (omni new) fix cannot identify options bug

### v1.0.6
1. pre-check node version，demand node >= 10.13.0

### v1.0.5
1. <omni.config.js>, add `dev.middleware` field

2. <omni.config.js>, add `dev.logLevel` field

3. <omni.config.js>, `dev.webpack_config` change to `dev.webpack`

### v1.0.4
1. [dev-server] start process optimization

2. (omni init) change `omni init -s` and `omni init --simple` to `omni init -b` and `omni init --basic`

### v1.0.3
1. (omni build) auto-release optimization, get rid of relying on NPM script and call release method directly

### v1.0.2
1. toolkit-project support tsc build

### v1.0.1
1. optimized log output

### v1.0.0
1. add `omni dev` command that support the development server which powered by Express and webpack-dev-server 

---

## v0.2.x
1. stable version

## v0.1.x
1. available version, please upgrade the latest version

## v0.0.x
1. informal version, please upgrade the latest version

---

**The Meaning of Tags**：
- \<xxx> - template

- (xxx) - command

- [xxx] - behavior or feature or function