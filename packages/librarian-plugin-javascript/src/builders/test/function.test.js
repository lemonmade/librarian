import {firstEntity} from './utils';
import {FunctionType, ParamType, TypeType} from '../../entities';

describe('function', () => {
  it('creates a function', () => {
    expect(firstEntity('function foo() {}'))
      .to.be.an.entityOfType(FunctionType);
  });

  describe('.name', () => {
    it('extracts the function name', () => {
      expect(firstEntity('function foo() {}'))
        .to.have.property('name')
        .that.equals('foo');
    });
  });

  describe('.async', () => {
    it('is not async by default', () => {
      expect(firstEntity('function foo() {}'))
        .to.have.property('async')
        .that.is.false;
    });

    it('is async for async functions', () => {
      expect(firstEntity('async function foo() {}'))
        .to.have.property('async')
        .that.is.true;
    });
  });

  describe('.generator', () => {
    it('is not a generator by default', () => {
      expect(firstEntity('function foo() {}'))
        .to.have.property('generator')
        .that.is.false;
    });

    it('is a generator for generator functions', () => {
      expect(firstEntity('function * foo() {}'))
        .to.have.property('generator')
        .that.is.true;
    });
  });

  describe('.returns', () => {
    it('has no return by default', () => {
      expect(firstEntity('function foo() {}'))
        .to.have.property('returns')
        .that.is.null;
    });

    it('has a return with a flow type', () => {
      expect(firstEntity('function foo(): string {}'))
        .to.have.property('returns')
        .that.is.an.entityOfType(TypeType)
        .that.has.properties({type: 'string'});
    });
  });

  describe('.params', () => {
    it('has no params by default', () => {
      expect(firstEntity('function foo() {}'))
        .to.have.property('params')
        .that.is.empty;
    });

    it('has params inferred from the function’s parameters', () => {
      const functionEntity = firstEntity('function foo(bar, baz) {}');

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
      const functionEntity = firstEntity(`
        /**
         * @param {string} foo
         */
        function foo(bar) {}
      `);

      expect(functionEntity)
        .to.have.deep.property('params[0].type')
        .that.is.an.entityOfType(TypeType)
        .that.has.properties({type: 'string'});
    });
  });
});
