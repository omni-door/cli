import { describe, it } from 'mocha';
import { expect } from 'chai';
import { getHandlers, handlerFactory } from '../tackle_plugins';
import logo from '../logo';

describe('tackle_plugins test', function () {
  it('type checking', function () {
    expect(getHandlers).to.be.a('function');
    expect(handlerFactory).to.be.a('function');
  });
});

describe('logo test', function () {
  it('type checking', function () {
    expect(logo).to.be.a('string');
  });
});