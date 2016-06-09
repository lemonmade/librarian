import processSass from './processor';
import {MixinType} from './entities';

export default function librarianPluginJavaScript({nested = false} = {}) {
  return function register({processor, library}) {
    processor.add({
      name: 'librarian-plugin-sass',
      match: /.scss$/,
      process: processSass,
    });

    library.namespace(nested ? 'sass' : library.root, (namespace) => {
      namespace.entities({name: 'mixins', type: MixinType});
    });
  };
}
