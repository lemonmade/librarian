import {firstEntity} from './utils';
import {ParamType, TypeType} from '../../entities';

function getParamEntity(source) {
  return firstEntity(source).params[0];
}

describe('param', () => {
  it('creates a param', () => {
    expect(getParamEntity('function foo(bar) {}'))
      .to.be.an.entityOfType(ParamType);
  });

  describe('.name', () => {
    it('extracts the param’s name', () => {
      expect(getParamEntity('function foo(bar) {}'))
        .to.have.property('name')
        .that.equals('bar');
    });
  });

  describe('.default', () => {
    it('has no default value by default', () => {
      expect(getParamEntity('function foo(bar) {}'))
        .not.to.have.property('default');
    });

    it('uses a default literal as the default value', () => {
      expect(getParamEntity('function foo(bar = "baz") {}'))
        .to.have.property('default')
        .that.equals('baz');
    });
  });

  describe('.type', () => {
    it('has no type by default', () => {
      expect(getParamEntity('function foo(bar) {}'))
        .to.have.property('type')
        .that.is.null;
    });

    it('uses a flow type', () => {
      expect(getParamEntity('function foo(bar: string) {}'))
        .to.have.property('type')
        .that.is.an.entityOfType(TypeType)
        .that.has.properties({type: 'string'});
    });

    it('infers a type from a default value', () => {
      expect(getParamEntity('function foo(bar = "baz") {}'))
        .to.have.property('type')
        .that.is.an.entityOfType(TypeType)
        .that.has.properties({type: 'string'});
    });
  });
});
