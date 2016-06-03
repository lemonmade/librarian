import {firstEntity} from './utils';
import {ClassType} from '../../entities';

describe('class', () => {
  it('creates a class', () => {
    expect(firstEntity('class Foo {}'))
      .to.be.an.entityOfType(ClassType);
  });

  describe('.name', () => {
    it('extracts the name', () => {
      expect(firstEntity('class Foo {}'))
        .to.have.property('name')
        .that.equals('Foo');
    });
  });

  describe('.extends', () => {
    it('extends no classes by default', () => {
      expect(firstEntity('class Foo {}'))
        .to.have.property('extends')
        .that.is.null;
    });

    it('extends no class when we can’t find the superclass', () => {
      expect(firstEntity('class Foo extends Bar {}'))
        .to.have.property('extends')
        .that.is.null;
    });

    it('extends a class that is found in scope', () => {
      const classEntity = firstEntity(`
        class Foo extends Bar {}
        class Bar {}
      `);

      expect(classEntity)
        .to.have.property('extends')
        .that.is.an.entityOfType(ClassType)
        .with.properties({name: 'Bar'});
    });
  });
});
