import { TESTFRAME } from './../../../index.d';

export default function (config: {
  testFrame: TESTFRAME;
  toolName: string;
}) {
  const { testFrame, toolName } = config;

  if (testFrame === 'jest') {
    return `import ${toolName} from '../';

describe('${toolName}', () => {
  it('renders correctly', () => {
    expect(${toolName}).anything();
  });
});`;
  }

  return `import 'mocha'
import { expect } from 'chai'
import ${toolName} from '../'

describe("${toolName} test", function () {
  it('${toolName} is a function', function () {
    expect(${toolName}).to.be.a('function')
  })
})`;

}

