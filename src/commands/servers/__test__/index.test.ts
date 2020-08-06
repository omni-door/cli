import { describe, it } from 'mocha';
import { expect } from 'chai';
import {
  EWServer,
  KNServer
} from '../index';

describe('express-webpack server test', function () {
  it('type checking', function () {
    expect(EWServer).to.be.a('function');
  });
});

describe('koa-next server test', function () {
  it('type checking', function () {
    expect(KNServer).to.be.a('function');
  });
});