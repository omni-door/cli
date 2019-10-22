const path = require('path');

module.exports = {

  // module 生成的目标目录
  modulePath: path.resolve('dist'),

  // module template 目录
  moduleTemplatePath: path.resolve('meet/templates/module'),

  // project git url
  gitUrl: 'your git url',

  // module build npm command
  npmBuildCommand: 'npm run release:',

  // upload assets config
  upload: {
    // CDN Server
    server: 'w1',// w1 CDN静态资源服务
    // server config
    config: {
      accessKeyId: '',
      accessKeySecret: '',
      bucket: '',
      region: '',
      srcDir: path.resolve('dist/assets'),// 要上传的dist文件夹
      ignoreDir: false,
      deduplication: true,
      prefix: 'xxx.xxx.com',
    }
  },

  // is publish after build?
  autoPublish: false
};
