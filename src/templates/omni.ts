
import { NPM, GenerateOmniConfigParams } from '../index.d';

export default (config: GenerateOmniConfigParams) => {
  const { project_type, build, ts, test, testFrame, eslint, commitlint, style, stylelint, git, npm, mdx } = config;

  const npmMap = {
    npm: 'https://registry.npmjs.org/',
    yarn: 'https://registry.yarnpkg.com/',
    cnpm: 'https://registry.yarnpkg.com/',
    taobao: 'https://registry.yarnpkg.com/'
  };

  return `'use strict';

const path = require('path');
${project_type === 'spa_react' ? `const merge = require('webpack-merge');
const prod_config = require('./configs/webpack.config.prod.js');` : ''}
${project_type !== 'component_library_react' ? 'const dev_config = require(\'./configs/webpack.config.dev.js\');\n' : ''}
module.exports = {
  type: '${project_type}', // 项目类型，请勿变动 (project type, please don't modify)
  ${project_type !== 'component_library_react' ? `\n  dev: {
    webpack_config: dev_config, // 开发服务端webpack配置文件路径 (dev-server webpack config path)
    proxy:  [
      // { 
      //   route: '/api',
      //   config: {
      //     target: 'http://www.api.com/api',
      //     changeOrigin: true
      //   }
      // }
    ], // 开发服务代理配置 (dev-server proxy config)
    port: 6200 // 开发服务端口号 (dev-server port)
  },\n` : '' }
  build: {
    auto_release: false, // 构建完成后是否自动发布 (auto release project after build success)
    // 输入路径 (the build source directory)
    // 务必使用绝对路径 (must be a absolute path)
    src_dir: ${project_type === 'toolkit' ? 'path.resolve(\'src/toolkit\')' : 'path.resolve(\'src\')'},
    // 输出路径 (the directory for compiled project)
    // 务必使用绝对路径 (must be a absolute path)
    out_dir: path.resolve('lib'),
    ${project_type !== 'spa_react' ? `// es6 module输出路径 (es6 module compiled directory)
    // 务必使用绝对路径 (must be a absolute path)
    esm_dir: path.resolve('es'),` : ''}
    ${project_type !== 'component_library_react' ? `// (构建阶段的自定义配置回调) The callback will be call in the build-process
    // (返回自定义的配置) You can return your custom build configuration
    ${project_type === 'spa_react' ? 'configuration: config => merge(config, prod_config)' : 'configuration: config => config'},` : ''}
    ${project_type === 'toolkit' ? `tool: '${build}', // 打包工具，支持 tsc、rollup、webpack (build tool, support tsc, rollup and webpack)` : ''}
    reserve: {
      style: ${style && build !== 'webpack' ? true : false}, // 构建结果是否保留样式文件 (whether or not reserve the stylesheet files)
      assets: [] // 构建结果保留其他资源的路径 (reserve other asset paths)
    },
    preflight: {
      typescript: ${!!ts}, // 是否处理ts或tsx文件 (whether or not process the ts or tsx files)
      test: ${!!test}, // 是否进行单元测试 (whether or not process unit-test)
      eslint: ${!!eslint}, // 是否进行eslint检测 (whether or not process eslint fix and check)
      stylelint: ${!!stylelint}, // 是否进行stylelint检测 (whether or not process style lint check)
    }
  },

  release: {
    git: '${git}', // 发布的git仓库地址 (project git repo url)
    npm: '${npmMap[npm as NPM] || npm}', // 发布的npm仓库地址 (npm depository url)
    preflight: {
      test: ${!!test}, // 发布前是否进行单元测试 (whether or not process unit-test)
      eslint: ${!!eslint}, // 发布前是否进行eslint检测 (whether or not process eslint fix and check)
      stylelint: ${!!stylelint}, // 发布前是否进行stylelint检测 (whether or not process style lint check)
      commitlint: ${!!commitlint}, // 发布前是否进行单元测试commitlint检测 (whether or not process commit lint check)
      branch: 'master' // 发布前进行分支检测，设置为空字符串则不会检测 (only can release in this branch, set empty string to ignore this check)
    }
  },

  template: {
    // 生成模板的根路径 (the root directory for generate template)
    // 务必使用绝对路径 (must be a absolute path)
    root: ${project_type === 'toolkit' ? 'path.resolve(\'src/toolkit\')' : 'path.resolve(\'src\')'},
    typescript: ${!!ts}, // 是否创建ts文件 (whether or not apply typescript)
    test: '${testFrame}', // 创建单元测试文件类型 (the unit test frame)
    stylesheet: '${style === 'all' ? 'less' : style}', // 样式文件类型 (stylesheet type)
    readme: [true, ${mdx ? '\'mdx\'' : '\'md\''}] // [是否生成ReadMe文件, 创建md 或 mdx文件] ([whether or not README.md, generate mdx or md file])
  },

  plugins: []
};`;
};
