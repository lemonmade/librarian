import processRuby from './processor';
import {ComponentType} from './entities';

export default function librarianPluginShopify({nested = false} = {}) {
  return function register({processor, library}) {
    processor.add({
      name: 'librarian-plugin-shopify/ruby',
      match: /.rb$/,
      process: processRuby,
    });

    library.namespace(nested ? 'shopify' : library.root, (namespace) => {
      namespace.entities({name: 'components', type: ComponentType});
    });
  };
}
