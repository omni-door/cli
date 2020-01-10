import { describe, it } from 'mocha';
import { expect } from 'chai';
import storybook_addons from '../addons';
import storybook_config from '../config';
import storybook_manager from '../addons';
import storybook_webpack from '../webpack';

describe('storybook_addons template test', function () {
  it('type checking', function () {
    expect(storybook_addons).to.be.a('function');
  });
});

describe('storybook_config template test', function () {
  it('type checking', function () {
    expect(storybook_config).to.be.a('function');
  });
});

describe('storybook_manager template test', function () {
  it('type checking', function () {
    expect(storybook_manager).to.be.a('function');
  });
});

describe('storybook_webpack template test', function () {
  it('type checking', function () {
    expect(storybook_webpack).to.be.a('function');
  });
});