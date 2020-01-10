import { describe, it } from 'mocha';
import { expect } from 'chai';
import server_index from '../index';
import server_webpack from '../webpack_dev';

describe('server_index template test', function () {
  it('type checking', function () {
    expect(server_index).to.be.a('function');
  });
});

describe('server_webpack template test', function () {
  it('type checking', function () {
    expect(server_webpack).to.be.a('function');
  });
});