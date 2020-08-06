import { describe, it } from 'mocha';
import { expect } from 'chai';
import release from '../index';

describe('release command test', function () {
  it('type checking', function () {
    expect(release).to.be.a('function');
  });
});