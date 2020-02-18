# Docs
**@omni-door/cli** provides the ability of secondary development, which is implemented through plug-in or import form。

---

## Plugin
The Plugin provides the third-party developers with the ability to perform multiple tasks in each lifecycle of the project. Please make sure that the Plugin writing meets the type definition of `type OmniPlugin`.

### Type of plugin
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

### Type of OmniConfig
```ts
import { Configuration } from 'webpack';
import { Config } from 'http-proxy-middleware';

type OmniConfig = {
  type: PROJECT_TYPE;
  dev: {
    port?: number;
    webpack?: Configuration;
    proxy?: {
      route: string;
      config: Config;
    }[];
    logLevel: 'debug' | 'info' | 'warn' | 'error' | 'silent';
  };
  build: {
    auto_release?: boolean;
    src_dir: string;
    out_dir: string;
    esm_dir?: string;
    configuration?: (config: ANYOBJECT) => ANYOBJECT;
    tool?: BUILD;
    preflight?: {
      typescript?: boolean;
      test?: boolean;
      eslint?: boolean;
      stylelint?: boolean;
    };
    reserve?: {
      style?: boolean;
      assets?: string[];
    };
  };
  release: {
    git?: string;
    npm?: NPM | string;
    preflight?: {
      test?: boolean;
      eslint?: boolean;
      stylelint?: boolean;
      commitlint?: boolean;
      branch?: string;
    };
  };
  template: {
    root: string;
    test?: TESTFRAME;
    typescript?: boolean;
    stylesheet?: STYLE;
    readme?: [boolean, 'mdx' | 'md'];
  };
  plugins?: OmniPlugin[];
};

export type BUILD = 'webpack' | 'rollup' | 'tsc' | '';
type NPM = 'npm' | 'yarn' | 'cnpm' | 'taobao';
type PROJECT_TYPE = 'spa_react' | 'component_library_react' | 'toolkit';
type TESTFRAME = 'mocha' | 'jest' | 'karma' | '';
type STYLE = 'less' | 'scss' | 'css' | 'all' | '';
```

- `name`: the name of plugin

- `stage`: the stage of plugin execution

- `handler`: executed callback function, returned in the form of `promise`

  - through `import { PluginHandler_Release } from '@omni-door/cli/lib/index.d';` to get the type that *handler* should satisfy
  - support: `PluginHandler_Dev`, `PluginHandler_Build`, `PluginHandler_Release`, `PluginHandler_New`
---

## The commands by import
- `import { initial } from '@omni-door/cli';`: get the initial instruction, then call with paramter directly:

  ```ts
  initial({
    standard: true // initial a standard project
  }, {
    // before the project initial
    before: dir_name => ({
      create_dir: false // avoid create new dir
    }),
    tpls: tpls => {
      // modify omni.config.js
      return {
        omni: configs => {
          let fn = tpls.omni;
          let fn2Str = fn.toString();
          fn2Str = fn2Str.replace('const path = require(\'path\');', 'const path = require(\'path\');\\nconst fs = require(\'fs\')');
          eval(`fn = ${fn2Str}`);

          return fn(configs);
        },
        // return an empty string will not generate commitlint.config.js file
        commitlint: config => ''
      };
    },
    dependencies: () => ['peeler-js'], // install project dependencies
    devDependencies: () => ['webpack-cli'], // install project devDependencies
    // after finish the project initial
    after: () => {
      return {
        success: true,
        msg: 'build success!'
      };
    },
    // custom the name of omni.config.js file
    configFileName: 'custom.config.js'
  });
  ```

- Other phases commands: `import { dev, new as newTpl, build, release } from '@omni-door/cli';`

- Support custom logo and brand:
  ```ts
  import { setLogo, setBrand } from '@omni-door/cli';

  setLogo('🐸');
  setBrand('some_prefix：');
  ```