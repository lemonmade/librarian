import {getFirstMatch, getLibraryFromSource} from './utilities';
import {ExportType, FunctionType} from '../entities';

describe('export', () => {
  function getFirstExport(source) {
    return getFirstMatch({source, type: ExportType});
  }

  describe('default', () => {
    it('creates a default export', () => {
      expect(getFirstExport('export default function foo() {}'))
        .to.be.an.entityOfType(ExportType)
        .with.properties({name: 'default', isDefaultExport: true});
    });

    it('stores the export as the value', () => {
      expect(getFirstExport('export default function foo() {}'))
        .to.have.property('value')
        .that.is.an.entityOfType(FunctionType)
        .with.properties({name: 'foo'});
    });
  });

  describe('named', () => {
    it('creates a named export', () => {
      expect(getFirstExport('export function foo() {}'))
        .to.be.an.entityOfType(ExportType)
        .with.properties({name: 'foo', isNamedExport: true});
    });

    it('creates a named export with specifiers', () => {
      const exportEntity = getFirstExport(`
        function foo() {}
        export {foo};
      `);

      expect(exportEntity)
        .to.be.an.entityOfType(ExportType)
        .with.properties({name: 'foo', isNamedExport: true});
    });

    it('uses an export identifier in a specifier as the name', () => {
      const exportEntity = getFirstExport(`
        function foo() {}
        export {foo as bar};
      `);

      expect(exportEntity)
        .to.be.an.entityOfType(ExportType)
        .with.properties({name: 'bar', isNamedExport: true});
    });

    it('handles multiple export specifiers', () => {
      const library = getLibraryFromSource(`
        function foo() {}
        function bar() {}
        export {foo as baz, bar};
      `);

      const exports = library.findAll(ExportType.check);

      expect(exports.find((anExport) => anExport.name === 'baz')).to.exist;
      expect(exports.find((anExport) => anExport.name === 'bar')).to.exist;
    });
  });
});
