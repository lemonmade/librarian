import {getFirstMatch} from './utilities';
import {FunctionType, ParamType, TypeType} from '../entities';

describe('function', () => {
  function getFirstFunction(source) {
    return getFirstMatch({source, type: FunctionType});
  }

  it('creates a function', () => {
    expect(getFirstFunction('export default function foo() {}'))
      .to.be.an.entityOfType(FunctionType);
  });

  describe('.name', () => {
    it('extracts the function name', () => {
      expect(getFirstFunction('export default function foo() {}'))
        .to.have.properties({name: 'foo'});
    });
  });

  describe('.async', () => {
    it('is not async by default', () => {
      expect(getFirstFunction('export default function foo() {}'))
        .to.have.properties({async: false});
    });

    it('is async for async functions', () => {
      expect(getFirstFunction('export default async function foo() {}'))
        .to.have.properties({async: true});
    });
  });

  describe('.generator', () => {
    it('is not a generator by default', () => {
      expect(getFirstFunction('export default function foo() {}'))
        .to.have.properties({generator: false});
    });

    it('is a generator for generator functions', () => {
      expect(getFirstFunction('export default function* foo() {}'))
        .to.have.properties({generator: true});
    });
  });

  describe('.returns', () => {
    it('has no return by default', () => {
      expect(getFirstFunction('export default function foo() {}'))
        .to.have.properties({returns: null});
    });

    it('has a return with a flow type', () => {
      expect(getFirstFunction('export default function foo(): string {}'))
        .to.have.property('returns')
        .that.is.an.entityOfType(TypeType)
        .that.has.properties({type: 'string'});
    });
  });

  describe('.params', () => {
    it('has no params by default', () => {
      expect(getFirstFunction('export default function foo() {}'))
        .to.have.property('params')
        .that.is.empty;
    });

    it('has params inferred from the function’s parameters', () => {
      const functionEntity = getFirstFunction('export default function foo(bar, baz) {}');

      expect(functionEntity)
        .to.have.property('params')
        .with.length(2);

      expect(functionEntity)
        .to.have.deep.property('params[0]')
        .that.is.an.entityOfType(ParamType)
        .that.has.properties({name: 'bar'});

      expect(functionEntity)
        .to.have.deep.property('params[1]')
        .that.is.an.entityOfType(ParamType)
        .that.has.properties({name: 'baz'});
    });

    it('uses a type listed in a @param tag for the function', () => {
      const functionEntity = getFirstFunction(`
        /// @param {string} foo
        export default function foo(bar) {}
      `);

      expect(functionEntity)
        .to.have.deep.property('params[0].type')
        .that.is.an.entityOfType(TypeType)
        .that.has.properties({type: 'string'});
    });
  });
});
