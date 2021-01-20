import { describe, it } from 'mocha';
import { expect } from 'chai';
import { getHandlers, handlerFactory, logo, signal, getTag } from '../';


describe('tackle_plugins test', function () {
  it('type checking', function () {
    expect(getHandlers).to.be.a('function');
    expect(handlerFactory).to.be.a('function');
  });

  it('call getHandlers', function () {
    getHandlers([
      {
        stage: 'build',
        name: 'test-build',
        handler: function () {
          console.info('test handle build plugins');
          return Promise.resolve();
        }
      }
    ], 'build');
    getHandlers([
      {
        stage: 'new',
        name: 'test-new',
        handler: function () {
          console.info('test handle new plugins');
          return Promise.resolve();
        }
      }
    ], 'new');
    getHandlers([
      {
        stage: 'release',
        name: 'test-release',
        handler: function () {
          console.info('test handle release plugins');
          return Promise.resolve();
        }
      }
    ], 'release');
  });

  it('call handlerFactory', function () {
    const buildFn = handlerFactory(function () {
      console.info('test handle build plugins');
      return Promise.resolve();
    });
    const newFn = handlerFactory(function () {
      console.info('test handle new plugins');
      return Promise.resolve();
    });
    const releaseFn = handlerFactory(function () {
      console.info('test handle release plugins');
      return Promise.resolve();
    });
  });
});

describe('logo test', function () {
  it('type checking', function () {
    expect(logo).to.be.a('function');
    expect(logo()).to.be.a('string');
  });

  it('value checking', function () {
    expect(logo()).to.be.equal('🐸  ');
  });
});

describe('signal test', function () {
  it('type checking', function () {
    expect(signal).to.be.a('function');
  });
});

describe('getTag test', function () {
  it('type checking', function () {
    expect(getTag).to.be.a('function');
  });

  it('value checking', function () {
    const { TPLTAG, CLITAG } = getTag();
    expect(TPLTAG).to.be.a('string');
    expect(CLITAG).to.be.a('undefined');
  });
});