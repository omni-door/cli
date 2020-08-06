import { describe, it } from 'mocha';
import { expect } from 'chai';
import start from '../index';

describe('start command test', function () {
  it('type checking', function () {
    expect(start).to.be.a('function');
  });
});