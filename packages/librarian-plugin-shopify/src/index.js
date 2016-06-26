import plugin from 'librarian/src/plugin';
import processRuby from './processor';
import {ComponentType} from './entities';

export default plugin('Shopify', ({nested = false}) => ({
  setup({library}) {
    library.namespace(nested ? 'shopify' : library.root, (namespace) => {
      namespace.entities({name: 'components', type: ComponentType});
    });
  },

  shouldProcess({filename}) { return /\.rb$/.test(filename); },
  process: processRuby,
}));
