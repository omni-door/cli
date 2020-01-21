import { describe, it } from 'mocha';
import { expect } from 'chai';
import exec from '../exec';
import getLogPrefix, { setLogo, getLogo, setBrand, getBrand } from '../log_prefix';
import { logDetail, logEmph, logInfo, logErr, logWarn, logSuc } from '../logger';
import node_version from '../node_version';
import output_file from '../output_file';
import { getHandlers, handlerFactory } from '../tackle_plugins';

describe('exec test', function () {
  it('type checking', function () {
    expect(exec).to.be.a('function');
  });
});

describe('log_prefix test', function () {
  it('type checking', function () {
    expect(getLogPrefix).to.be.a('function');
    expect(setLogo).to.be.a('function');
    expect(getLogo).to.be.a('function');
    expect(setBrand).to.be.a('function');
    expect(getBrand).to.be.a('function');
  });
});

describe('logger test', function () {
  it('type checking', function () {
    expect(logDetail).to.be.a('function');
    expect(logEmph).to.be.a('function');
    expect(logInfo).to.be.a('function');
    expect(logErr).to.be.a('function');
    expect(logWarn).to.be.a('function');
    expect(logSuc).to.be.a('function');
  });
});

describe('node_version test', function () {
  it('type checking', function () {
    expect(node_version).to.be.a('function');
  });
});

describe('output_file test', function () {
  it('type checking', function () {
    expect(output_file).to.be.a('function');
  });
});

describe('tackle_plugins test', function () {
  it('type checking', function () {
    expect(getHandlers).to.be.a('function');
    expect(handlerFactory).to.be.a('function');
  });
});