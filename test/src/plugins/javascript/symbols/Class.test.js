import 'test-helper';
import {symbolize} from 'test-utilities';
import classFromPath from 'plugins/javascript/symbols/class';
import functionFromPath from 'plugins/javascript/symbols/function';

describe('class', () => {
  describe('.name', () => {
    it('extracts the class name', () => {
      expect(symbolize('class Foo {}', classFromPath))
        .to.have.property('name')
        .that.equals('Foo');
    });
  });

  describe('.superclass', () => {
    it('extracts the superclass name', () => {
      expect(symbolize('class Foo extends Bar {}', classFromPath))
        .to.have.property('superclass')
        .that.equals('Bar');
    });
  });

  describe('.constructor', () => {
    it('has no constructor by default', () => {
      expect(symbolize('class Foo {}', classFromPath))
      .to.have.property('constructor')
      .that.is.undefined;
    });

    it('extracts the constructor', () => {
      const constructor = 'constructor({foo}, bar, baz) {}';
      expect(symbolize(`class Foo {\n  ${constructor}\n}`, classFromPath))
        .to.have.property('constructor')
        .that.deep.equals(symbolize(`function ${constructor}`, functionFromPath));
    });
  });

  describe('.methods', () => {
    const method = 'myMethod({foo, bar}, baz) {}';

    it('has an empty array for no methods', () => {
      expect(symbolize('class Foo {}', classFromPath))
      .to.have.property('methods')
      .that.is.empty;
    });

    it('has an array of class methods', () => {
      expect(symbolize(`class Foo {\n  ${method}\n}`, classFromPath))
      .to.have.property('methods')
      .that.deep.equals([
        symbolize(`function ${method}`, functionFromPath),
      ]);
    });
  });
});
