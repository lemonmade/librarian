import processor from './processor';
import {ClassType, FunctionType} from './types';
import {arrayOf} from '../../types/base';

export default function setup(register) {
  register('JavaScript', (config) => {
    config.processor(processor);
    config.matches(/\.js$/);

    config.viewer({
      classes: {type: arrayOf(ClassType)},
      functions: {type: arrayOf(FunctionType)},
    });
  });
}
