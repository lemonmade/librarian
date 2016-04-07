import 'test-helper';
import {firstSymbol} from 'test-utilities';

describe('Class', () => {
  const className = 'MyClass';

  it('extracts the name', () => {
    const symbol = classFromSource(`class ${className} {}`);
    expect(symbol.name).to.equal(className);
  });
});

function classFromSource(source) {
  return firstSymbol(source);
}
