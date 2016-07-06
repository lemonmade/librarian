import {getFirstMatch, getLibraryFromSource} from './utilities';
import {ExportType, FunctionType, PrimitiveType, TypeType} from '../entities';

describe('export', () => {
  async function getFirstExport(source) {
    return await getFirstMatch({source, type: ExportType});
  }

  describe('default', () => {
    it('creates a default export', async () => {
      expect(await getFirstExport('export default function foo() {}'))
        .to.be.an.entityOfType(ExportType)
        .with.properties({name: 'default', isDefaultExport: true});
    });

    it('stores the export as the value', async () => {
      expect(await getFirstExport('export default function foo() {}'))
        .to.have.property('value')
        .that.is.an.entityOfType(FunctionType)
        .with.properties({name: 'foo'});
    });
  });

  describe('named', () => {
    it('creates a named export', async () => {
      expect(await getFirstExport('export function foo() {}'))
        .to.be.an.entityOfType(ExportType)
        .with.properties({name: 'foo', isNamedExport: true});
    });

    it('creates a named export with specifiers', async () => {
      const exportEntity = await getFirstExport(`
        function foo() {}
        export {foo};
      `);

      expect(exportEntity)
        .to.be.an.entityOfType(ExportType)
        .with.properties({name: 'foo', isNamedExport: true});
    });

    it('uses an export identifier in a specifier as the name', async () => {
      const exportEntity = await getFirstExport(`
        function foo() {}
        export {foo as bar};
      `);

      expect(exportEntity)
        .to.be.an.entityOfType(ExportType)
        .with.properties({name: 'bar', isNamedExport: true});
    });

    it('handles multiple export specifiers', async () => {
      const library = await getLibraryFromSource(`
        function foo() {}
        function bar() {}
        export {foo as baz, bar};
      `);

      const exports = library.findAll(ExportType.check);

      expect(exports.find((anExport) => anExport.name === 'baz')).to.exist;
      expect(exports.find((anExport) => anExport.name === 'bar')).to.exist;
    });

    it('handles named export variable declarations', async () => {
      const exportEntity = await getFirstExport('export const foo = 123;');

      expect(exportEntity)
        .to.be.an.entityOfType(ExportType)
        .with.properties({name: 'foo', isNamedExport: true});

      expect(exportEntity)
        .to.have.property('value')
        .that.is.an.entityOfType(PrimitiveType);
    });

    it('handles type exports', async () => {
      const exportEntity = await getFirstExport('export type Foo = number;');

      expect(exportEntity)
        .to.be.an.entityOfType(ExportType)
        .with.properties({name: 'Foo', isNamedExport: true});

      expect(exportEntity)
        .to.have.property('value')
        .that.is.an.entityOfType(TypeType);
    });
  });
});
