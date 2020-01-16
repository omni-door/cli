export default function () {
  return `'use strict';

const path = require('path');
const open = require('open');
const ip = require('ip');
const detectPort = require('detect-port');
const inquirer = require('inquirer');
const express = require('express');
const proxy = require('http-proxy-middleware');
const { exec } = require('child_process');
const webpack = require('webpack');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config.dev.js');

(async function () {
  let port = 6200;
  const _port = await detectPort(port).catch(err => {
    console.error(err);
    process.exit(1);
  });
  
  port !== _port && (port = _port)
  const compiler = webpack(config);
    const app = express();

    app.use(devMiddleware(compiler, {
      publicPath: '/',
      logLevel: 'debug'
    }));

    app.use(hotMiddleware(compiler, {
      log: console.info, 
      path: '/__webpack_hmr', 
      heartbeat: 10 * 1000
    }));

    // app.use(
    //   '/api',
    //   proxy({
    //     target: 'http://www.api.com/api',
    //     changeOrigin: true
    //   })
    // );

    app.use('*', function (req, res, next) {
      const filename = path.join(compiler.outputPath, 'index.html');
      compiler.outputFileSystem.readFile(filename, function (err, result) {
        if (err) {
          return next(err);
        }
        res.set('content-type', 'text/html');
        res.send(result);
        res.end();
      });
    });

    app.listen(port, (...args) => {
      console.log('args', args);
  
      const url_local = 'http://localhost:' + port;
      const url_ip = 'http://' + ip.address() + ':' + port;
      open(url_ip);
      console.info('> Ready on local: ' + url_local);
      console.info('> Ready on ip: ' + url_ip);
    });
})()
`;
}