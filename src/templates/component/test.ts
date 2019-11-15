import { TESTFRAME } from './../../index.d';

export default function (config: {
  testFrame: TESTFRAME;
  componentName: string;
}) {
  const { testFrame, componentName } = config;

  if (testFrame === 'jest') {
    return `import * as React from 'react';
import { configure, shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ${componentName} from '../index';

configure({ adapter: new Adapter() });

describe('${componentName}', () => {
  it('renders correctly', () => {
    const wrapper = render(
      <${componentName} />
    );
    expect(wrapper).toMatchSnapshot();
  });
});`;
  }

  return `import 'mocha'
import { expect } from 'chai'
import ${componentName} from '../'

describe("${componentName} test", function () {
  it('${componentName} is a function', function () {
    expect(${componentName}).to.be.a('function')
  })
})`;

}

