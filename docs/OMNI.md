# omni.config.js Detail

## type
OMNI will process of initialization, construction and template creation according to different project types

The project types:

- spa_react - React single-page-application

- component_library_react - React Component Library

- toolkit - SDK Library 

## dev
The dev-server based on express, realizing hot-update, api-proxy and other common functions. Provide personalized customization schemes such as middleware customization, port number, log output level and webpack configuration.

- middleware - middleware configuration:

    ```ts
    {
      route: string;
      callback: (req: any, res: any) => Promise<void>;
    }
    ```

- webpack - dev-server webpack configuration

- proxy - dev-server proxy configuration

    ```js
    {
      route: '/api', // Address of the local service for the proxy API
      config: {
        target: 'http://www.api.com/api', // The actual address of the proxy API
        changeOrigin: true // whether change the host
      }
    }
    ```

    For more configuration, see [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)

- port - dev-server port

- logLevel - The log-level which dev-server will apply, optional 'debug', 'info', 'warn', 'error', 'silent'

## build

- auto_release - auto release project after build success

- src_dir - the build source directory

- out_dir - the directory for compiled project

- esm_dir - es6 module compiled directory

- hash - whether the hash tag add to building result

- configuration - The callback will be call in the build-process, you can return your custom build configuration

- reserve - Configure resources that are not packaged but need to be kept in the build result
  - style - whether or not reserve the stylesheet files

  - assets - reserve other asset paths

- preflight - the flight check before build
  - typescript - whether or not process the ts or tsx files

  - test - whether or not process unit-test

  - eslint - whether or not process eslint fix and check

  - stylelint - whether or not process style lint check

## release
- git - project git repo url

- npm - npm depository url

- preflight - the flight check before release
  - test - whether or not process unit-test

  - eslint - whether or not process eslint fix and check

  - stylelint - whether or not process style lint check

  - commitlint - whether or not process commit lint check

  - branch - only can release in this branch, set empty string to ignore this check

## template 新建模板配置
- root - the root directory for generate template

- typescript - whether or not apply typescript

- test - the unit test frame

- stylesheet - stylesheet type

- readme - [true, 'mdx'] ([whether or not README.md, generate mdx or md file])

## plugins
plugin must meet following types:

```ts
type OmniPlugin = {
  name: string;
  stage: PluginStage;
  handler: PluginHandler;
};

type PluginStage = 'new' | 'build' | 'release';
interface PluginHandler {
  (config: Omit<OmniConfig, 'plugins'>): Promise<any>;
  (config: Omit<OmniConfig, 'plugins'>, tpls: TPLS_NEW): Promise<TPLS_NEW_RETURE>;
}
```