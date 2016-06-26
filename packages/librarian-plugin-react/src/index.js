import librarianPluginJavaScript from 'librarian-plugin-javascript';
import {ComponentType} from './entities';
import * as Builders from './builders';

const builders = Object.values(Builders);

export default function librarianPluginReact(options = {}) {
  const {nested = false} = options;

  const registerJavaScript = librarianPluginJavaScript({
    ...options,
    customValueEntities: [ComponentType],
    customBuilders: builders,
  });

  return function register(details) {
    const {library} = details;

    registerJavaScript(details);

    library.namespace(nested ? 'react' : library.root, (namespace) => {
      namespace.entities({name: 'components', type: ComponentType});
    });
  };
}
