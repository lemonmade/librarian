import plugin from 'librarian/src/plugin';
import {extname} from 'path';

import createProcessor from './processor';
import resolve from './resolve';
import {ClassType, FunctionType, ValueType, ExportType, ModuleType} from './entities';

export default plugin('ESNext', ({nested = false}) => {
  let processor;
  const builders = [];
  const valueEntities = [];
  const extensions = ['js'];

  return {
    setup({library}) {
      library.namespace(nested ? 'esnext' : library.root, (namespace) => {
        namespace.entities({name: 'classes', type: ClassType});
        namespace.entities({name: 'functions', type: FunctionType});
        namespace.entities({name: 'constants', type: ValueType});
        namespace.entities({name: 'exports', type: ExportType});
        namespace.entities({name: 'modules', type: ModuleType});
      });

      library.resolveID({for: 'ESNext', resolve});
    },

    shouldProcess({filename}) {
      return extensions.includes(extname(filename).replace(/^\./, ''));
    },
    process(...args) {
      processor = processor || createProcessor({
        customBuilders: builders,
        customValueEntities: valueEntities,
      });

      return processor(...args);
    },

    // Extension points for other JS-related plugins
    addExtensions(newExtensions) {
      for (const extension of newExtensions) {
        extensions.push(extension.replace(/^\./, ''));
      }
    },
    addValueEntities(newEntities) {
      valueEntities.push(...newEntities);
    },
    addBuilders(newBuilders) {
      builders.push(...newBuilders);
    },
  };
});
