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
        .that.containSubset(symbolize(`function ${constructor}`, functionFromPath));
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
        .to.have.deep.property('methods[0]')
        .that.containSubset(symbolize(`function ${method}`, functionFromPath));
    });

    describe('.name', () => {
      context('when names are computed', () => {
        const computedMethod = method.replace('myMethod', '[myMethod]');

        it('returns nothing when the name will not evaluate', () => {
          expect(symbolize(`class Foo {\n  ${computedMethod}\n}`, classFromPath))
            .to.have.property('methods')
            .that.is.empty;
        });

        it('returns the method when the name will evaluate evaluate', () => {
          const name = 'fooBar';
          expect(symbolize(`var myMethod = "${name}";\nclass Foo{\n  ${computedMethod}\n}`, classFromPath, {nth: 1}))
            .to.have.deep.property('methods[0]')
            .that.containSubset({name});
        });
      });
    });

    describe('.static', () => {
      it('is not static when it is a class method', () => {
        expect(symbolize(`class Foo {\n  ${method}\n}`, classFromPath))
          .to.have.deep.property('methods[0]')
          .that.containSubset({static: false});
      });

      it('is static when it is a static class method', () => {
        expect(symbolize(`class Foo {\n  static ${method}\n}`, classFromPath))
          .to.have.deep.property('methods[0]')
          .that.containSubset({static: true});
      });
    });

    describe('.async', () => {
      it('is not async when it is a regular method', () => {
        expect(symbolize(`class Foo {\n  ${method}\n}`, classFromPath))
          .to.have.deep.property('methods[0]')
          .that.containSubset({async: false});
      });

      it('is async when it is a async method', () => {
        expect(symbolize(`class Foo {\n  async ${method}\n}`, classFromPath))
          .to.have.deep.property('methods[0]')
          .that.containSubset({async: true});
      });
    });

    describe('.generator', () => {
      it('is not generator when it is a regular method', () => {
        expect(symbolize(`class Foo {\n  ${method}\n}`, classFromPath))
          .to.have.deep.property('methods[0]')
          .that.containSubset({generator: false});
      });

      it('is generator when it is a generator method', () => {
        expect(symbolize(`class Foo {\n  * ${method}\n}`, classFromPath))
          .to.have.deep.property('methods[0]')
          .that.containSubset({generator: true});
      });
    });
  });

  describe('.properties', () => {
    const property = 'myProp = true;';

    it('has an empty array for no properties', () => {
      expect(symbolize('class Foo {}', classFromPath))
        .to.have.property('properties')
        .that.is.empty;
    });

    it('has an array of class properties', () => {
      expect(symbolize(`class Foo {\n  ${property}\n}`, classFromPath))
        .to.have.deep.property('properties[0]')
        .that.containSubset({name: 'myProp'});
    });

    describe('.static', () => {
      it('is not static when it is a class property', () => {
        expect(symbolize(`class Foo {\n  ${property}\n}`, classFromPath))
          .to.have.deep.property('properties[0]')
          .that.containSubset({static: false});
      });

      it('is static when it is a static class property', () => {
        expect(symbolize(`class Foo {\n  static ${property}\n}`, classFromPath))
          .to.have.deep.property('properties[0]')
          .that.containSubset({static: true});
      });
    });
  });
});
