import {getLibraryFromFiles} from './utilities';
import {ModuleType, ExportType} from '../entities';

describe('module', () => {
  const filename = 'baz.js';

  async function getFirstModule(source) {
    const library = await getLibraryFromFiles([{filename, source}]);
    return library.find((entity) => ModuleType.check(entity));
  }

  it('creates a module', async () => {
    const result = await getFirstModule('const foo = bar;');

    expect(result)
      .to.be.an.entityOfType(ModuleType)
      .with.properties({name: filename});
  });

  it('creates an export for a default export', async () => {
    const result = await getFirstModule('export default function foo() {}');
    expect(result)
      .to.have.deep.property('exports[0]')
      .that.is.an.entityOfType(ExportType);
  });
});
