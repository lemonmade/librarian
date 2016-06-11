import {getFirstMatch} from './utilities';
import {ModuleType, ExportType} from '../entities';

describe('module', () => {
  it('creates a module', () => {
    const filename = 'foo/bar/baz.js';
    const result = getFirstMatch({filename, source: '', type: ModuleType});

    expect(result)
      .to.be.an.entityOfType(ModuleType)
      .with.properties({name: filename});
  });

  it('creates an export for a default export', () => {
    const result = getFirstMatch({source: 'export default function foo() {}', type: ModuleType});
    expect(result)
      .to.have.deep.property('exports[0]')
      .that.is.an.entityOfType(ExportType);
  });
});
