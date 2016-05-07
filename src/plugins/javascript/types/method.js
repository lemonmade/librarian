import defineType from '../../../types/define';
import {booleanType, enumType} from '../../../types/base';

import FunctionType from './function';

const KindEnum = enumType({
  name: 'MethodKind',
  options: ['constructor', 'method'],
});

export default defineType('Method', {
  extends: FunctionType,
  properties: {
    kind: {type: KindEnum, default: 'method'},
    static: {type: booleanType, default: false},
  },
});
