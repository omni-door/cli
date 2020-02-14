import { describe, it } from 'mocha';
import { expect } from 'chai';
import dependencies_build from '../dependencies_build';
import getDependency, { arr2str } from '../dependencies_strategy';
import { dependencies as dependencies_stable, devDependencies as devDependencies_stable } from '../dependencies_stable_map';
import { dependencies, devDependencies } from '../dependencies';
import {
  cli_basic,
  cli_standard,
  cli_entire,
  cli_lib_toolkit,
  cli_lib_components
} from '../initial_clis';
import {
  tpl_basic,
  tpl_standard,
  tpl_entire,
  tpl_lib_toolkit,
  tpl_lib_components
} from '../initial_tpls';

describe('dependencies_build test', function () {
  it('type checking', function () {
    expect(dependencies_build).to.be.a('function');
  });
});

describe('dependencies_stable_map test', function () {
  it('type checking', function () {
    expect(dependencies_stable).to.be.an('object');
    expect(devDependencies_stable).to.be.an('object');
  });
});

describe('dependencies_strategy test', function () {
  it('type checking', function () {
    expect(getDependency).to.be.a('function');
    expect(arr2str).to.be.a('function');
  });
});

describe('dependencies test', function () {
  it('type checking', function () {
    expect(dependencies).to.be.a('function');
    expect(devDependencies).to.be.a('function');
  });
});

describe('initial_clis test', function () {
  it('type checking', function () {
    expect(cli_basic).to.be.a('object');
    expect(cli_standard).to.be.a('object');
    expect(cli_entire).to.be.a('object');
    expect(cli_lib_toolkit).to.be.a('object');
    expect(cli_lib_components).to.be.a('object');
  });
});

describe('initial_tpls test', function () {
  it('type checking', function () {
    expect(tpl_basic).to.be.a('object');
    expect(tpl_standard).to.be.a('object');
    expect(tpl_entire).to.be.a('object');
    expect(tpl_lib_toolkit).to.be.a('object');
    expect(tpl_lib_components).to.be.a('object');
  });
});