import processor from './processor';
import {ClassType, FunctionType, ValueType} from './entities';
import {arrayOf} from 'librarian/src/types';

export default function create(options = {}) {
  return function setup(register) {
    register('JavaScript', (config) => {
      config.processor(processor);
      config.matches(/\.js$/);

      config.library({
        classes: {
          type: arrayOf(ClassType),
          resolve(library) {
            return library.get(ClassType);
          },
        },
        functions: {
          type: arrayOf(FunctionType),
          resolve(library) {
            return library.get(FunctionType);
          },
        },
        constants: {
          type: arrayOf(ValueType),
          resolve(library) {
            return library.get(ValueType);
          },
        },
      });
    });
  };
}
