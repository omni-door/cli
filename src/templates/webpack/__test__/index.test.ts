import { describe, it } from 'mocha';
import { expect } from 'chai';
import config_common from '../common';
import config_dev from '../dev';
import config_prod from '../prod';

describe('config_common template test', function () {
  it('type checking', function () {
    expect(config_common).to.be.a('function');
  });
});

describe('config_dev template test', function () {
  it('type checking', function () {
    expect(config_dev).to.be.a('function');
  });
});

describe('config_prod template test', function () {
  it('type checking', function () {
    expect(config_prod).to.be.a('function');
  });
});