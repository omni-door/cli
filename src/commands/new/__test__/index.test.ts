import { describe, it } from 'mocha';
import { expect } from 'chai';
import newTpl from '../index';

describe('new command test', function () {
  it('type checking', function () {
    expect(newTpl).to.be.a('function');
  });
});