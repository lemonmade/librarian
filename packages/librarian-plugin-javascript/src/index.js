import processJS from './processor';
import {ClassType, FunctionType, ValueType} from './entities';

export default function librarianPluginJavaScript({nested = false} = {}) {
  return function register({processor, library}) {
    processor.add({
      name: 'librarian-plugin-javascript',
      match: /.js$/,
      process: processJS,
    });

    library.namespace(nested ? 'javascript' : library.root, (namespace) => {
      namespace.entities({name: 'classes', type: ClassType});
      namespace.entities({name: 'functions', type: FunctionType});
      namespace.entities({name: 'constants', type: ValueType});
    });
  };
}
