import { describe, it } from 'mocha';
import { expect } from 'chai';
import source_declaration from '../declaration';
import source_html from '../html';
import source_index from '../index';
import source_index_react from '../index_react';

describe('source_declaration template test', function () {
  it('type checking', function () {
    expect(source_declaration).to.be.a('function');
  });
});

describe('source_html template test', function () {
  it('type checking', function () {
    expect(source_html).to.be.a('function');
  });
});

describe('source_index template test', function () {
  it('type checking', function () {
    expect(source_index).to.be.a('function');
  });
});

describe('source_index_react template test', function () {
  it('type checking', function () {
    expect(source_index_react).to.be.a('function');
  });
});