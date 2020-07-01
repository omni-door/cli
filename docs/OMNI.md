# omni.config.js Detail

## type
OMNI will process of initialization, construction and template creation according to different project types

The project types:

- spa-react - React single-page-application

- component-library-react - React Component Library

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

    or

    ```ts
    (params: {
      ip: string;
      port: number;
      host?: string;
      logLevel: LOGLEVEL;
      proxyConfig?: (ProxyItem | ProxyFn)[];
    }) => {
      route: string;
      callback: (req: any, res: any) => Promise<void>;
    }
    ```

- webpack - dev-server webpack configuration

- proxy - dev-server proxy configuration

    ```ts
    {
      route: '/api', // Address of the local service for the proxy API
      config: {
        target: 'http://www.api.com/api', // The actual address of the proxy API
        changeOrigin: true // whether change the host
      }
    }
    ```

    or

    ```ts
    (params: {
      ip: string;
      port: number;
      host?: string;
      logLevel: LOGLEVEL;
      middlewareConfig?: (MiddlewareItem | MiddlewareFn)[];
    }) => {
      route: string;
      config: Config;
    }
    ```

    For more configuration, see [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)

- port - dev-server port

- host - dev-server host

- serverType - dev-server type

- logLevel - The log-level which dev-server will apply, optional 'debug', 'info', 'warn', 'error', 'silent'

## build

- autoRelease - auto release project after build success

- srcDir - the build source directory

- outDir - the directory for compiled project

- esmDir - es6 module compiled directory

- hash - whether the hash tag add to building result, optional 'contenthash', 'chunkhash' and 'hash'(true equal 'contenthash')

- configuration - The callback will be call in the build-process, you can return your custom build configuration

- reserve - Configure resources that are not packaged but need to be kept in the build result
  - style - whether or not reserve the stylesheet files

  - assets - reserve other asset paths

- preflight - the flight check before build
  - typescript - whether or not process the ts or tsx files

  - test - whether or not process unit-test

  - eslint - whether or not process eslint check

  - prettier - whether or not process prettier check

  - stylelint - whether or not process stylelint check

## release
- git - project git repo url

- npm - npm depository url

- preflight - the flight check before release
  - test - whether or not process unit-test

  - eslint - whether or not process eslint check

  - prettier - whether or not process prettier check

  - stylelint - whether or not process stylelint check

  - commitlint - whether or not process commitlint check

  - branch - only can release in this branch, set empty string to ignore this check

## template
- root - the root directory for generate template

- typescript - whether or not apply typescript

- test - whether or not generate unit-test file

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
}
```