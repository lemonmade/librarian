import {expect, firstSymbol} from 'test-helper';

describe('Param', () => {
  const className = 'MyClass';

  it('extracts the name', () => {
    const symbol = classFromSource(`class ${className} {}`);
    expect(symbol.name).to.equal(className);
  });
});

function classFromSource(source) {
  return firstSymbol(source);
}
