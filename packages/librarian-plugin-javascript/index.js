import processor from './processor';
import {ClassType, FunctionType} from './entities';
import {arrayOf} from 'librarian/types';

export default function create(options = {}) {
  return function setup(register) {
    register('JavaScript', (config) => {
      config.processor(processor);
      config.matches(/\.js$/);

      config.viewer({
        classes: {type: arrayOf(ClassType)},
        functions: {type: arrayOf(FunctionType)},
      });
    });
  }
}
