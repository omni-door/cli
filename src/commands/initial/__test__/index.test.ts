import { describe, it } from 'mocha';
import { expect } from 'chai';
import initial from '../index';
import {
  cli_basic_react,
  cli_standard_react,
  cli_entire_react,
  cli_basic_vue,
  cli_standard_vue,
  cli_entire_vue,
  cli_ssr_react,
  cli_components_react,
  cli_components_vue,
  cli_toolkit
} from '../initial_preset';


describe('initial command test', function () {
  it('type checking', function () {
    expect(initial).to.be.a('function');
  });
});

describe('initial preset test', function () {
  it('cli_basic_react checking', function () {
    expect(cli_basic_react).to.be.an('object');

    expect(cli_basic_react.build).to.be.a('string');
    expect(cli_basic_react.build).to.be.equal('webpack');

    expect(cli_basic_react.pkgtool).to.be.a('string');
    expect(cli_basic_react.pkgtool).to.be.equal('pnpm');

    expect(cli_basic_react['project_type']).to.be.a('string');
    expect(cli_basic_react['project_type']).to.be.equal('spa-react');

    expect(cli_basic_react.ts).to.be.a('boolean');
    expect(cli_basic_react.ts).to.be.false;

    expect(cli_basic_react.testFrame).to.be.a('string');
    expect(cli_basic_react.testFrame).to.be.equal('');

    expect(cli_basic_react.eslint).to.be.a('boolean');
    expect(cli_basic_react.eslint).to.be.false;

    expect(cli_basic_react.commitlint).to.be.a('boolean');
    expect(cli_basic_react.commitlint).to.be.false;

    expect(cli_basic_react.style).to.be.a('string');
    expect(cli_basic_react.style).to.be.equal('css');

    expect(cli_basic_react.stylelint).to.be.a('boolean');
    expect(cli_basic_react.stylelint).to.be.false;
  });

  it('cli_standard_react checking', function () {
    expect(cli_standard_react).to.be.an('object');

    expect(cli_standard_react.build).to.be.a('string');
    expect(cli_standard_react.build).to.be.equal('webpack');

    expect(cli_standard_react.pkgtool).to.be.a('string');
    expect(cli_standard_react.pkgtool).to.be.equal('pnpm');

    expect(cli_standard_react['project_type']).to.be.a('string');
    expect(cli_standard_react['project_type']).to.be.equal('spa-react');

    expect(cli_standard_react.ts).to.be.a('boolean');
    expect(cli_standard_react.ts).to.be.true;

    expect(cli_standard_react.testFrame).to.be.a('string');
    expect(cli_standard_react.testFrame).to.be.equal('');

    expect(cli_standard_react.eslint).to.be.a('boolean');
    expect(cli_standard_react.eslint).to.be.true;

    expect(cli_standard_react.commitlint).to.be.a('boolean');
    expect(cli_standard_react.commitlint).to.be.false;

    expect(cli_standard_react.style).to.be.a('string');
    expect(cli_standard_react.style).to.be.equal('less');

    expect(cli_standard_react.stylelint).to.be.a('boolean');
    expect(cli_standard_react.stylelint).to.be.true;
  });

  it('cli_entire_react checking', function () {
    expect(cli_entire_react).to.be.an('object');

    expect(cli_entire_react.build).to.be.a('string');
    expect(cli_entire_react.build).to.be.equal('webpack');

    expect(cli_entire_react.pkgtool).to.be.a('string');
    expect(cli_entire_react.pkgtool).to.be.equal('pnpm');

    expect(cli_entire_react['project_type']).to.be.a('string');
    expect(cli_entire_react['project_type']).to.be.equal('spa-react');

    expect(cli_entire_react.ts).to.be.a('boolean');
    expect(cli_entire_react.ts).to.be.true;

    expect(cli_entire_react.testFrame).to.be.a('string');
    expect(cli_entire_react.testFrame).to.be.equal('jest');

    expect(cli_entire_react.eslint).to.be.a('boolean');
    expect(cli_entire_react.eslint).to.be.true;

    expect(cli_entire_react.commitlint).to.be.a('boolean');
    expect(cli_entire_react.commitlint).to.be.true;

    expect(cli_entire_react.style).to.be.a('string');
    expect(cli_entire_react.style).to.be.equal('all');

    expect(cli_entire_react.stylelint).to.be.a('boolean');
    expect(cli_entire_react.stylelint).to.be.true;
  });

  it('cli_basic_vue checking', function () {
    expect(cli_basic_vue).to.be.an('object');

    expect(cli_basic_vue.build).to.be.a('string');
    expect(cli_basic_vue.build).to.be.equal('webpack');

    expect(cli_basic_vue.pkgtool).to.be.a('string');
    expect(cli_basic_vue.pkgtool).to.be.equal('pnpm');

    expect(cli_basic_vue['project_type']).to.be.a('string');
    expect(cli_basic_vue['project_type']).to.be.equal('spa-vue');

    expect(cli_basic_vue.ts).to.be.a('boolean');
    expect(cli_basic_vue.ts).to.be.false;

    expect(cli_basic_vue.testFrame).to.be.a('string');
    expect(cli_basic_vue.testFrame).to.be.equal('');

    expect(cli_basic_vue.eslint).to.be.a('boolean');
    expect(cli_basic_vue.eslint).to.be.false;

    expect(cli_basic_vue.commitlint).to.be.a('boolean');
    expect(cli_basic_vue.commitlint).to.be.false;

    expect(cli_basic_vue.style).to.be.a('string');
    expect(cli_basic_vue.style).to.be.equal('css');

    expect(cli_basic_vue.stylelint).to.be.a('boolean');
    expect(cli_basic_vue.stylelint).to.be.false;
  });

  it('cli_standard_vue checking', function () {
    expect(cli_standard_vue).to.be.an('object');

    expect(cli_standard_vue.build).to.be.a('string');
    expect(cli_standard_vue.build).to.be.equal('webpack');

    expect(cli_standard_vue.pkgtool).to.be.a('string');
    expect(cli_standard_vue.pkgtool).to.be.equal('pnpm');

    expect(cli_standard_vue['project_type']).to.be.a('string');
    expect(cli_standard_vue['project_type']).to.be.equal('spa-vue');

    expect(cli_standard_vue.ts).to.be.a('boolean');
    expect(cli_standard_vue.ts).to.be.true;

    expect(cli_standard_vue.testFrame).to.be.a('string');
    expect(cli_standard_vue.testFrame).to.be.equal('');

    expect(cli_standard_vue.eslint).to.be.a('boolean');
    expect(cli_standard_vue.eslint).to.be.true;

    expect(cli_standard_vue.commitlint).to.be.a('boolean');
    expect(cli_standard_vue.commitlint).to.be.false;

    expect(cli_standard_vue.style).to.be.a('string');
    expect(cli_standard_vue.style).to.be.equal('less');

    expect(cli_standard_vue.stylelint).to.be.a('boolean');
    expect(cli_standard_vue.stylelint).to.be.true;
  });

  it('cli_entire_vue checking', function () {
    expect(cli_entire_vue).to.be.an('object');

    expect(cli_entire_vue.build).to.be.a('string');
    expect(cli_entire_vue.build).to.be.equal('webpack');

    expect(cli_entire_vue.pkgtool).to.be.a('string');
    expect(cli_entire_vue.pkgtool).to.be.equal('pnpm');

    expect(cli_entire_vue['project_type']).to.be.a('string');
    expect(cli_entire_vue['project_type']).to.be.equal('spa-vue');

    expect(cli_entire_vue.ts).to.be.a('boolean');
    expect(cli_entire_vue.ts).to.be.true;

    expect(cli_entire_vue.testFrame).to.be.a('string');
    expect(cli_entire_vue.testFrame).to.be.equal('jest');

    expect(cli_entire_vue.eslint).to.be.a('boolean');
    expect(cli_entire_vue.eslint).to.be.true;

    expect(cli_entire_vue.commitlint).to.be.a('boolean');
    expect(cli_entire_vue.commitlint).to.be.true;

    expect(cli_entire_vue.style).to.be.a('string');
    expect(cli_entire_vue.style).to.be.equal('all');

    expect(cli_entire_vue.stylelint).to.be.a('boolean');
    expect(cli_entire_vue.stylelint).to.be.true;
  });

  it('cli_ssr_react checking', function () {
    expect(cli_ssr_react).to.be.an('object');

    expect(cli_ssr_react.build).to.be.a('string');
    expect(cli_ssr_react.build).to.be.equal('next');

    expect(cli_ssr_react.pkgtool).to.be.a('string');
    expect(cli_ssr_react.pkgtool).to.be.equal('pnpm');

    expect(cli_ssr_react['project_type']).to.be.a('string');
    expect(cli_ssr_react['project_type']).to.be.equal('ssr-react');

    expect(cli_ssr_react.ts).to.be.a('boolean');
    expect(cli_ssr_react.ts).to.be.true;

    expect(cli_ssr_react.testFrame).to.be.a('string');
    expect(cli_ssr_react.testFrame).to.be.equal('jest');

    expect(cli_ssr_react.eslint).to.be.a('boolean');
    expect(cli_ssr_react.eslint).to.be.true;

    expect(cli_ssr_react.prettier).to.be.a('boolean');
    expect(cli_ssr_react.prettier).to.be.true;

    expect(cli_ssr_react.commitlint).to.be.a('boolean');
    expect(cli_ssr_react.commitlint).to.be.true;

    expect(cli_ssr_react.style).to.be.a('string');
    expect(cli_ssr_react.style).to.be.equal('all');

    expect(cli_ssr_react.stylelint).to.be.a('boolean');
    expect(cli_ssr_react.stylelint).to.be.true;

    expect(cli_ssr_react.serverType).to.be.a('string');
    expect(cli_ssr_react.serverType).to.be.equal('next');
  });

  it('cli_components_react checking', function () {
    expect(cli_components_react).to.be.an('object');

    expect(cli_components_react.build).to.be.a('string');
    expect(cli_components_react.build).to.be.equal('tsc');

    expect(cli_components_react.pkgtool).to.be.a('string');
    expect(cli_components_react.pkgtool).to.be.equal('yarn');

    expect(cli_components_react['project_type']).to.be.a('string');
    expect(cli_components_react['project_type']).to.be.equal('component-react');

    expect(cli_components_react.ts).to.be.a('boolean');
    expect(cli_components_react.ts).to.be.true;

    expect(cli_components_react.testFrame).to.be.a('string');
    expect(cli_components_react.testFrame).to.be.equal('jest');

    expect(cli_components_react.eslint).to.be.a('boolean');
    expect(cli_components_react.eslint).to.be.true;

    expect(cli_components_react.commitlint).to.be.a('boolean');
    expect(cli_components_react.commitlint).to.be.true;

    expect(cli_components_react.style).to.be.a('string');
    expect(cli_components_react.style).to.be.equal('less');

    expect(cli_components_react.stylelint).to.be.a('boolean');
    expect(cli_components_react.stylelint).to.be.true;

    expect(cli_components_react.devServer).to.be.a('string');
    expect(cli_components_react.devServer).to.be.equal('docz');
  });

  it('cli_components_vue checking', function () {
    expect(cli_components_vue).to.be.an('object');

    expect(cli_components_vue.build).to.be.a('string');
    expect(cli_components_vue.build).to.be.equal('tsc');

    expect(cli_components_vue.pkgtool).to.be.a('string');
    expect(cli_components_vue.pkgtool).to.be.equal('yarn');

    expect(cli_components_vue['project_type']).to.be.a('string');
    expect(cli_components_vue['project_type']).to.be.equal('component-vue');

    expect(cli_components_vue.ts).to.be.a('boolean');
    expect(cli_components_vue.ts).to.be.true;

    expect(cli_components_vue.testFrame).to.be.a('string');
    expect(cli_components_vue.testFrame).to.be.equal('jest');

    expect(cli_components_vue.eslint).to.be.a('boolean');
    expect(cli_components_vue.eslint).to.be.true;

    expect(cli_components_vue.commitlint).to.be.a('boolean');
    expect(cli_components_vue.commitlint).to.be.true;

    expect(cli_components_vue.style).to.be.a('string');
    expect(cli_components_vue.style).to.be.equal('less');

    expect(cli_components_vue.stylelint).to.be.a('boolean');
    expect(cli_components_vue.stylelint).to.be.true;

    expect(cli_components_vue.devServer).to.be.a('string');
    expect(cli_components_vue.devServer).to.be.equal('storybook');
  });

  it('cli_toolkit checking', function () {
    expect(cli_toolkit).to.be.an('object');

    expect(cli_toolkit.build).to.be.a('string');
    expect(cli_toolkit.build).to.be.equal('rollup');

    expect(cli_toolkit.pkgtool).to.be.a('string');
    expect(cli_toolkit.pkgtool).to.be.equal('yarn');

    expect(cli_toolkit['project_type']).to.be.a('string');
    expect(cli_toolkit['project_type']).to.be.equal('toolkit');

    expect(cli_toolkit.ts).to.be.a('boolean');
    expect(cli_toolkit.ts).to.be.true;

    expect(cli_toolkit.testFrame).to.be.a('string');
    expect(cli_toolkit.testFrame).to.be.equal('mocha');

    expect(cli_toolkit.eslint).to.be.a('boolean');
    expect(cli_toolkit.eslint).to.be.true;

    expect(cli_toolkit.commitlint).to.be.a('boolean');
    expect(cli_toolkit.commitlint).to.be.true;

    expect(cli_toolkit.style).to.be.a('string');
    expect(cli_toolkit.style).to.be.equal('');

    expect(cli_toolkit.stylelint).to.be.a('boolean');
    expect(cli_toolkit.stylelint).to.be.false;
  });
});
