import { describe, it } from 'mocha';
import { expect } from 'chai';
import posts_readme from '../readme';

describe('posts_readme template test', function () {
  it('type checking', function () {
    expect(posts_readme).to.be.a('function');
  });
});