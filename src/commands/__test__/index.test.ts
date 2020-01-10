import { describe, it } from 'mocha';
import { expect } from 'chai';
import initial from '../initial';
import newTpl from '../new';
import build from '../build';
import release from '../release';

describe('initial command test', function () {
  it('type checking', function () {
    expect(initial).to.be.a('function');
  });
});

describe('new command test', function () {
  it('type checking', function () {
    expect(newTpl).to.be.a('function');
  });
});

describe('build command test', function () {
  it('type checking', function () {
    expect(build).to.be.a('function');
  });
});

describe('build command test', function () {
  it('type checking', function () {
    expect(release).to.be.a('function');
  });
});