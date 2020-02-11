# CHANGE LOG

## v1.0.x
### v1.0.0
1. add `omni dev` command that support the development server which powered by Express and webpack-dev-server 

### v1.0.1
1. optimized log output

### v1.0.2
1. toolkit-project support tsc build

### v1.0.3
1. [omni build] auto-release optimization, get rid of relying on NPM script and call release method directly

### v1.0.4
1. (dev-server) start process optimization

2. [omni init] change `omni init -s` and `omni init --simple` to `omni init -b` and `omni init --basic`

### v1.0.5
1. <omni.config.js>, add `dev.middleware` field

2. <omni.config.js>, add `dev.logLevel` field

3. <omni.config.js>, `dev.webpack_config` change to `dev.webpack`

### v1.0.6
1. pre-check node version，demand node >= 10.13.0

### v1.0.7
1. <tsconfig.json> template add project_type judgement

2. <omni.config.js> annotation change

3. <webpack.config.prod.js> optimize production environment packing

4. (dev-server) add run-time try/exception

5. [omni new] fix cannot identify options bug

### v1.0.8
1. [omni init] fix incorrect display of custom logo

2. [omni init] support remove origin dependencies

### v1.0.9
1. <package.json> add stylelint check paramter {--allow-empty-input}

---

## v0.2.x
1. stable version

## v0.1.x
1. available version, please upgrade the latest version

## v0.0.x
1. informal version, please upgrade the latest version