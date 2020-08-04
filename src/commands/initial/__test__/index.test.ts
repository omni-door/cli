import { describe, it } from 'mocha';
import { expect } from 'chai';
import initial from '../index';
import {
  cli_basic,
  cli_standard,
  cli_entire,
  cli_lib_components,
  cli_lib_toolkit
} from '../initial_preset';


describe('initial command test', function () {
  it('type checking', function () {
    expect(initial).to.be.a('function');
  });
});

describe('initial preset test', function () {
  it('cli_basic checking', function () {
    expect(cli_basic).to.be.an('object');

    expect(cli_basic.build).to.be.a('string');
    expect(cli_basic.build).to.be.equal('webpack');

    expect(cli_basic.pkgtool).to.be.a('string');
    expect(cli_basic.pkgtool).to.be.equal('yarn');

    expect(cli_basic['project_type']).to.be.a('string');
    expect(cli_basic['project_type']).to.be.equal('spa-react');

    expect(cli_basic.ts).to.be.a('boolean');
    expect(cli_basic.ts).to.be.false;

    expect(cli_basic.testFrame).to.be.a('string');
    expect(cli_basic.testFrame).to.be.equal('');

    expect(cli_basic.eslint).to.be.a('boolean');
    expect(cli_basic.eslint).to.be.false;

    expect(cli_basic.commitlint).to.be.a('boolean');
    expect(cli_basic.commitlint).to.be.false;

    expect(cli_basic.style).to.be.a('string');
    expect(cli_basic.style).to.be.equal('css');

    expect(cli_basic.stylelint).to.be.a('boolean');
    expect(cli_basic.stylelint).to.be.false;
  });

  it('cli_standard checking', function () {
    expect(cli_standard).to.be.an('object');

    expect(cli_standard.build).to.be.a('string');
    expect(cli_standard.build).to.be.equal('webpack');

    expect(cli_standard.pkgtool).to.be.a('string');
    expect(cli_standard.pkgtool).to.be.equal('yarn');

    expect(cli_standard['project_type']).to.be.a('string');
    expect(cli_standard['project_type']).to.be.equal('spa-react');

    expect(cli_standard.ts).to.be.a('boolean');
    expect(cli_standard.ts).to.be.true;

    expect(cli_standard.testFrame).to.be.a('string');
    expect(cli_standard.testFrame).to.be.equal('');

    expect(cli_standard.eslint).to.be.a('boolean');
    expect(cli_standard.eslint).to.be.true;

    expect(cli_standard.commitlint).to.be.a('boolean');
    expect(cli_standard.commitlint).to.be.false;

    expect(cli_standard.style).to.be.a('string');
    expect(cli_standard.style).to.be.equal('less');

    expect(cli_standard.stylelint).to.be.a('boolean');
    expect(cli_standard.stylelint).to.be.true;
  });

  it('cli_entire checking', function () {
    expect(cli_entire).to.be.an('object');

    expect(cli_entire.build).to.be.a('string');
    expect(cli_entire.build).to.be.equal('webpack');

    expect(cli_entire.pkgtool).to.be.a('string');
    expect(cli_entire.pkgtool).to.be.equal('yarn');

    expect(cli_entire['project_type']).to.be.a('string');
    expect(cli_entire['project_type']).to.be.equal('spa-react');

    expect(cli_entire.ts).to.be.a('boolean');
    expect(cli_entire.ts).to.be.true;

    expect(cli_entire.testFrame).to.be.a('string');
    expect(cli_entire.testFrame).to.be.equal('jest');

    expect(cli_entire.eslint).to.be.a('boolean');
    expect(cli_entire.eslint).to.be.true;

    expect(cli_entire.commitlint).to.be.a('boolean');
    expect(cli_entire.commitlint).to.be.true;

    expect(cli_entire.style).to.be.a('string');
    expect(cli_entire.style).to.be.equal('all');

    expect(cli_entire.stylelint).to.be.a('boolean');
    expect(cli_entire.stylelint).to.be.true;
  });

  it('cli_lib_components checking', function () {
    expect(cli_lib_components).to.be.an('object');

    expect(cli_lib_components.build).to.be.a('string');
    expect(cli_lib_components.build).to.be.equal('tsc');

    expect(cli_lib_components.pkgtool).to.be.a('string');
    expect(cli_lib_components.pkgtool).to.be.equal('yarn');

    expect(cli_lib_components['project_type']).to.be.a('string');
    expect(cli_lib_components['project_type']).to.be.equal('component-react');

    expect(cli_lib_components.ts).to.be.a('boolean');
    expect(cli_lib_components.ts).to.be.true;

    expect(cli_lib_components.testFrame).to.be.a('string');
    expect(cli_lib_components.testFrame).to.be.equal('jest');

    expect(cli_lib_components.eslint).to.be.a('boolean');
    expect(cli_lib_components.eslint).to.be.true;

    expect(cli_lib_components.commitlint).to.be.a('boolean');
    expect(cli_lib_components.commitlint).to.be.true;

    expect(cli_lib_components.style).to.be.a('string');
    expect(cli_lib_components.style).to.be.equal('less');

    expect(cli_lib_components.stylelint).to.be.a('boolean');
    expect(cli_lib_components.stylelint).to.be.true;

    expect(cli_lib_components.devServer).to.be.a('string');
    expect(cli_lib_components.devServer).to.be.equal('docz');
  });

  it('cli_lib_toolkit checking', function () {
    expect(cli_lib_toolkit).to.be.an('object');

    expect(cli_lib_toolkit.build).to.be.a('string');
    expect(cli_lib_toolkit.build).to.be.equal('rollup');

    expect(cli_lib_toolkit.pkgtool).to.be.a('string');
    expect(cli_lib_toolkit.pkgtool).to.be.equal('yarn');

    expect(cli_lib_toolkit['project_type']).to.be.a('string');
    expect(cli_lib_toolkit['project_type']).to.be.equal('toolkit');

    expect(cli_lib_toolkit.ts).to.be.a('boolean');
    expect(cli_lib_toolkit.ts).to.be.true;

    expect(cli_lib_toolkit.testFrame).to.be.a('string');
    expect(cli_lib_toolkit.testFrame).to.be.equal('mocha');

    expect(cli_lib_toolkit.eslint).to.be.a('boolean');
    expect(cli_lib_toolkit.eslint).to.be.true;

    expect(cli_lib_toolkit.commitlint).to.be.a('boolean');
    expect(cli_lib_toolkit.commitlint).to.be.true;

    expect(cli_lib_toolkit.style).to.be.a('string');
    expect(cli_lib_toolkit.style).to.be.equal('');

    expect(cli_lib_toolkit.stylelint).to.be.a('boolean');
    expect(cli_lib_toolkit.stylelint).to.be.false;
  });
});
