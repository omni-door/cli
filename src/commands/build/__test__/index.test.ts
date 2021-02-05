import { describe, it } from 'mocha';
import { expect } from 'chai';
import build from '../index';
import rollupConfig from '../rollup';
import webpackConfig from '../webpack';
import dependencies from '../dependencies_build';

describe('build command test', function () {
  it('type checking', function () {
    expect(build).to.be.a('function');
    expect(rollupConfig).to.be.a('function');
    expect(webpackConfig).to.be.a('function');
    expect(dependencies).to.be.a('function');
  });

  it('call rollupConfig', function () {
    const config1 = rollupConfig({
      ts: true,
      multiOutput: false,
      srcDir: 'src',
      outDir: 'lib',
      esmDir: 'es'
    });
    expect(config1).to.be.a('string');

    const config2 = rollupConfig({
      ts: false,
      multiOutput: true,
      srcDir: 'src',
      outDir: 'dist',
      esmDir: 'es',
      configFileName: 'custom.config.js'
    });
    expect(config2).to.be.a('string');
  });

  it('call webpackConfig', function () {
    const config1 = webpackConfig({
      ts: true,
      multiOutput: false,
      srcDir: 'src',
      outDir: 'lib',
      configFileName: 'custom.config.js'
    });
    expect(config1).to.be.a('string');

    const config2 = webpackConfig({
      ts: false,
      multiOutput: true,
      srcDir: 'src',
      outDir: 'dist',
      hash: 'chunkhash'
    });
    expect(config2).to.be.a('string');
  });

  it('call dependencies', function (done) {
    dependencies({
      build: 'webpack'
    }).then(webpackDependencies => {
      expect(webpackDependencies).to.be.a('string');
      expect(!!~webpackDependencies.indexOf('webpack')).to.be.true;
      dependencies({
        build: 'rollup'
      }).then(rollupDependencies => {
        expect(!!~rollupDependencies.indexOf('rollup')).to.be.true;
        done();
      });
    });
  });
});