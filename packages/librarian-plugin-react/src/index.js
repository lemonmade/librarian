import plugin from 'librarian/src/plugin';
import librarianPluginJavaScript from 'librarian-plugin-javascript';

import {ComponentType} from './entities';
import * as Builders from './builders';

const builders = Object.values(Builders);

export default plugin('React', (options) => {
  const {nested = false} = options;

  return {
    setup({library, plugins}) {
      const javascriptPlugin = plugins.findOrAdd(librarianPluginJavaScript, options);
      javascriptPlugin.addExtensions(['jsx']);
      javascriptPlugin.addValueEntities([ComponentType]);
      javascriptPlugin.addBuilders(builders);

      library.namespace(nested ? 'react' : library.root, (namespace) => {
        namespace.entities({name: 'components', type: ComponentType});
      });
    },
  };
});
