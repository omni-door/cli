export default function (config: {
  toolName: string;
}) {
  const { toolName } = config;

  return `import 'mocha'
import { expect } from 'chai'
import ${toolName} from '../'

describe("${toolName} test", function () {
  it('${toolName} is a function', function () {
    expect(${toolName}).to.be.a('function')
  })
})`;

}

