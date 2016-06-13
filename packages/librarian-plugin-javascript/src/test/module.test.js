import {getLibraryFromFiles} from './utilities';
import {ModuleType, ExportType} from '../entities';

describe('module', () => {
  const filename = 'baz.js';

  function getFirstModule(source) {
    const library = getLibraryFromFiles([{filename, source}]);
    return library.find((entity) => ModuleType.check(entity));
  }

  it('creates a module', () => {
    const result = getFirstModule('const foo = bar;');

    expect(result)
      .to.be.an.entityOfType(ModuleType)
      .with.properties({name: filename});
  });

  it('creates an export for a default export', () => {
    const result = getFirstModule('export default function foo() {}');
    expect(result)
      .to.have.deep.property('exports[0]')
      .that.is.an.entityOfType(ExportType);
  });
});
