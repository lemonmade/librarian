import {getFirstMatch, getLibraryFromSource, getLibraryFromFiles} from './utilities';
import {ClassType} from '../entities';

describe('class', () => {
  function getFirstClass(source) {
    return getFirstMatch({source, type: ClassType});
  }

  it('creates a class', () => {
    expect(getFirstClass('export default class Foo {}'))
      .to.be.an.entityOfType(ClassType);
  });

  describe('.name', () => {
    it('extracts the name', () => {
      expect(getFirstClass('export default class Foo {}'))
        .to.have.properties({name: 'Foo'});
    });
  });

  describe('.extends', () => {
    it('extends no classes by default', () => {
      expect(getFirstClass('export default class Foo {}'))
        .to.have.property('extends')
        .that.is.falsy;
    });

    it('extends no class when we can’t find the superclass', () => {
      expect(getFirstClass('export default class Foo extends Bar {}'))
        .to.have.property('extends')
        .that.is.falsy;
    });

    it('extends a class that is found in scope', () => {
      const library = getLibraryFromSource(`
        export default class Foo extends Bar {}
        class Bar {}
      `);

      const superClass = library.find({name: 'Bar'});
      const classEntity = library.find({name: 'Foo'});

      expect(classEntity)
        .to.have.property('extends')
        .that.equals(superClass);
    });

    it('extends a class across files', () => {
      const library = getLibraryFromFiles([
        {
          filename: 'example1.js',
          source: 'export default class Bar {}',
        },
        {
          filename: 'example2.js',
          source: `
            import Bar from './example1';
            export default class Foo extends Bar {}
          `,
        },
      ]);

      const superClass = library.find({name: 'Bar'});
      const classEntity = library.find({name: 'Foo'});

      expect(classEntity)
        .to.have.property('extends')
        .that.equals(superClass);
    });

    it('extends a member of an export across files', () => {
      const library = getLibraryFromFiles([
        {
          filename: 'example1.js',
          source: `
            class Baz {}

            export default class Bar {
              static Baz = Baz;
            }
          `,
        },
        {
          filename: 'example2.js',
          source: `
            import Bar from './example1';
            export default class Foo extends Bar.Baz {}
          `,
        },
      ]);

      const superClass = library.find({name: 'Baz'});
      const classEntity = library.find({name: 'Foo'});

      expect(classEntity)
        .to.have.property('extends')
        .that.equals(superClass);
    });
  });
});
