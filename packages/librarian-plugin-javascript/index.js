import processor from './processor';
import {ClassType, FunctionType} from './entities';
import {arrayOf} from 'librarian/types';

export default function create(options = {}) {
  return function setup(register) {
    register('JavaScript', (config) => {
      config.processor(processor);
      config.matches(/\.js$/);

      config.viewer({
        classes: {
          type: arrayOf(ClassType),
          resolve(parent) {
            return parent
              .filter((entity) => ClassType.check(entity))
              .map((entity) => ClassType(entity));
          },
        },
        functions: {
          type: arrayOf(FunctionType),
          resolve(parent) {
            return parent
              .filter((entity) => FunctionType.check(entity))
              .map((entity) => FunctionType(entity));
          },
        },
      });
    });
  }
}
