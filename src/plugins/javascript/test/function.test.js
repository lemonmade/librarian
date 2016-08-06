import {getFirstMatch} from './utilities';
import {FunctionType, ParamType, TypeType} from '../entities';

describe('function', () => {
  async function getFirstFunction(source) {
    return await getFirstMatch({source, type: FunctionType});
  }

  it('creates a function', async () => {
    expect(await getFirstFunction('export default function foo() {}'))
      .to.be.an.entityOfType(FunctionType);
  });

  describe('.name', () => {
    it('extracts the function name', async () => {
      expect(await getFirstFunction('export default function foo() {}'))
        .to.have.properties({name: 'foo'});
    });
  });

  describe('.async', () => {
    it('is not async by default', async () => {
      expect(await getFirstFunction('export default function foo() {}'))
        .to.have.properties({async: false});
    });

    it('is async for async functions', async () => {
      expect(await getFirstFunction('export default async function foo() {}'))
        .to.have.properties({async: true});
    });
  });

  describe('.generator', () => {
    it('is not a generator by default', async () => {
      expect(await getFirstFunction('export default function foo() {}'))
        .to.have.properties({generator: false});
    });

    it('is a generator for generator functions', async () => {
      expect(await getFirstFunction('export default function* foo() {}'))
        .to.have.properties({generator: true});
    });
  });

  describe('.returns', () => {
    it('has no return by default', async () => {
      expect(await getFirstFunction('export default function foo() {}'))
        .to.have.property('returns')
        .that.is.falsey;
    });

    it('has a return with a flow type', async () => {
      expect(await getFirstFunction('export default function foo(): string {}'))
        .to.have.property('returns')
        .that.is.an.entityOfType(TypeType)
        .that.has.properties({type: 'string'});
    });
  });

  describe('.params', () => {
    it('has no params by default', async () => {
      expect(await getFirstFunction('export default function foo() {}'))
        .to.have.property('params')
        .that.is.empty;
    });

    it('has params inferred from the function’s parameters', async () => {
      const functionEntity = await getFirstFunction('export default function foo(bar, baz) {}');

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

    it('uses a type listed in a @param tag for the function', async () => {
      const functionEntity = await getFirstFunction(`
        /// @param {string} foo
        export default function foo(bar) {}
      `);

      expect(functionEntity)
        .to.have.deep.property('params[0].type')
        .that.is.an.entityOfType(TypeType)
        .that.has.properties({type: 'string'});
    });
  });

  describe('function expression', () => {
    it('handles an assignment of a function expression', async () => {
      const functionEntity = await getFirstFunction(`
        /// @param {string} bar
        export const foo = function foo(bar) {}
      `);

      expect(functionEntity).to.have.properties({name: 'foo'});

      const param = functionEntity.params[0];
      expect(param).to.have.properties({name: 'bar'});
      expect(param)
        .to.have.property('type')
        .that.is.an.entityOfType(TypeType)
        .that.has.properties({type: 'string'});
    });
  });
});
