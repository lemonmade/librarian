import createProcessor from './processor';
import resolve from './resolve';
import {ClassType, FunctionType, ValueType, ExportType, ModuleType} from './entities';

const NAME = 'ESNext';

export default function librarianPluginJavaScript(options = {}) {
  const {nested = false} = options;

  return function register({processor, library}) {
    processor.add({name: NAME, match: /.js$/, process: createProcessor(options)});

    library.resolveID({resolve, for: NAME});
    library.namespace(nested ? 'esnext' : library.root, (namespace) => {
      namespace.entities({name: 'classes', type: ClassType});
      namespace.entities({name: 'functions', type: FunctionType});
      namespace.entities({name: 'constants', type: ValueType});
      namespace.entities({name: 'exports', type: ExportType});
      namespace.entities({name: 'modules', type: ModuleType});
    });
  };
}
