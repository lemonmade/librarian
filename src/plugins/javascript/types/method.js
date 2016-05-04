import defineType from '../../../types/define';
import {booleanType} from '../../../types/base';

import FunctionType from './function';

export default defineType('Method', {
  extends: FunctionType,
  properties: {
    static: {type: booleanType, default: false},
  },
});
