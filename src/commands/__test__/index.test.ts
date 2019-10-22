import { describe, it } from 'mocha';
import { expect } from 'chai';
import initial from '../initial';

describe('initial module test', function () {
  it('type checking', function () {
    expect(initial).to.be.a('function');
  });
});