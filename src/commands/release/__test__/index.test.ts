import { describe, it } from 'mocha';
import { expect } from 'chai';
import release from '../index';

describe('build command test', function () {
  it('type checking', function () {
    expect(release).to.be.a('function');
  });
});