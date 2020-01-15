export default function (config: {
  componentName: string;
}) {
  const { componentName } = config;

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

