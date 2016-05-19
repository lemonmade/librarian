import processor from './processor';
import {ComponentType} from './entities';
import {arrayOf} from 'librarian/src/types';

export default function create(options = {}) {
  return function setup(register) {
    register('Shopify', (config) => {
      config.processor(processor);
      config.matches(/\.rb$/);

      config.library({
        components: {
          type: arrayOf(ComponentType),
          resolve(library) {
            return library
              .filter((entity) => ComponentType.check(entity))
              .map((entity) => ComponentType(entity));
          },
        },
      });
    });
  };
}
