import { describe, it } from 'mocha';
import { expect } from 'chai';
import dev from '../index';
import run from '../run';
import server from '../server';

describe('dev command test', function () {
  it('type checking', function () {
    expect(dev).to.be.a('function');
    expect(run).to.be.a('function');
    expect(server).to.be.a('function');
  });
});