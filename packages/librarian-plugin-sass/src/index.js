import processSass from './processor';
import {MixinType, FunctionType, VariableType, PlaceholderType} from './entities';

export default function librarianPluginJavaScript({nested = false} = {}) {
  return function register({processor, library}) {
    processor.add({
      name: 'librarian-plugin-sass',
      match: /.scss$/,
      process: processSass,
    });

    library.namespace(nested ? 'sass' : library.root, (namespace) => {
      namespace.entities({name: 'mixins', type: MixinType});
      namespace.entities({name: 'functions', type: FunctionType});
      namespace.entities({name: 'variables', type: VariableType});
      namespace.entities({name: 'placeholders', type: PlaceholderType});
    });
  };
}
