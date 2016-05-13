import processor from './processor';
import {ClassType, FunctionType} from './entities';
import {arrayOf} from 'librarian/types';

export default function create(options = {}) {
  return function setup(register) {
    register('JavaScript', (config) => {
      config.processor(processor);
      config.matches(/\.js$/);

      config.library({
        classes: {
          type: arrayOf(ClassType),
          resolve(library) {
            return library
              .filter((entity) => ClassType.check(entity))
              .map((entity) => ClassType(entity));
          },
        },
        functions: {
          type: arrayOf(FunctionType),
          resolve(library) {
            return library
              .filter((entity) => FunctionType.check(entity))
              .map((entity) => FunctionType(entity));
          },
        },
      });
    });
  };
}
