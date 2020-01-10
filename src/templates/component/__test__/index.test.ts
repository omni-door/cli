import { describe, it } from 'mocha';
import { expect } from 'chai';
import component_class from '../class_component';
import component_function from '../functional_component';
import component_index from '../index';
import component_mdx from '../mdx';
import component_readme from '../readme';
import component_stories from '../stories';
import component_stylesheet from '../stylesheet';
import component_test from '../test';
import component_tool_index from '../tool/index';
import component_tool_readme from '../tool/readme';
import component_tool_test from '../tool/test';

describe('component_class template test', function () {
  it('type checking', function () {
    expect(component_class).to.be.a('function');
  });
});

describe('component_function template test', function () {
  it('type checking', function () {
    expect(component_function).to.be.a('function');
  });
});

describe('component_index template test', function () {
  it('type checking', function () {
    expect(component_index).to.be.a('function');
  });
});

describe('component_mdx template test', function () {
  it('type checking', function () {
    expect(component_mdx).to.be.a('function');
  });
});

describe('component_readme template test', function () {
  it('type checking', function () {
    expect(component_readme).to.be.a('function');
  });
});

describe('component_stories template test', function () {
  it('type checking', function () {
    expect(component_stories).to.be.a('function');
  });
});

describe('component_stylesheet template test', function () {
  it('type checking', function () {
    expect(component_stylesheet).to.be.a('function');
  });
});

describe('component_test template test', function () {
  it('type checking', function () {
    expect(component_test).to.be.a('function');
  });
});

describe('component_tool_index template test', function () {
  it('type checking', function () {
    expect(component_tool_index).to.be.a('function');
  });
});

describe('component_tool_readme template test', function () {
  it('type checking', function () {
    expect(component_tool_readme).to.be.a('function');
  });
});

describe('component_tool_test template test', function () {
  it('type checking', function () {
    expect(component_tool_test).to.be.a('function');
  });
});