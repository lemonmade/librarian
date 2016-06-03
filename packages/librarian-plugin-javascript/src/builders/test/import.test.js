import EntityProxy from 'librarian/src/entities/proxy';
import {buildPath} from './utils';

describe('import', () => {
  describe('default', () => {
    it('creates a proxy with the correct ID', () => {
      expect(buildPath('import Foo from "bar";', 'specifiers.0'))
        .to.be.an.instanceOf(EntityProxy)
        .that.has.property('id')
        .that.deep.equals({
          module: 'bar',
          name: 'default',
          member: {name: null, static: false},
        });
    });
  });

  describe('named', () => {
    it('creates a proxy with the correct ID', () => {
      expect(buildPath('import {Foo} from "bar";', 'specifiers.0'))
        .to.be.an.instanceOf(EntityProxy)
        .that.has.property('id')
        .that.deep.equals({
          module: 'bar',
          name: 'Foo',
          member: {name: null, static: false},
        });
    });
  });

  it('uses the import name when there is a local name', () => {
    expect(buildPath('import {Foo as Bar} from "bar";', 'specifiers.0'))
      .to.be.an.instanceOf(EntityProxy)
      .that.has.deep.property('id.name')
      .that.equals('Foo');
  });

  it('understands a renamed default import', () => {
    expect(buildPath('import {default as Bar} from "bar";', 'specifiers.0'))
      .to.be.an.instanceOf(EntityProxy)
      .that.has.deep.property('id.name')
      .that.equals('default');
  });
});
