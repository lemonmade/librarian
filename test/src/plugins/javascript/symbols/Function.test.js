import 'test-helper';
import {firstSymbol} from 'test-utilities';

describe('Function', () => {
  const functionName = 'myFunction';

  it('extracts the name', () => {
    const symbol = functionFromSource(`function ${functionName}() {}`);
    expect(symbol.name).to.equal(functionName);
  });
});

function functionFromSource(source) {
  return firstSymbol(source);
}
