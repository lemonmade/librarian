import define from 'librarian/entities';
import {booleanType, enumType} from 'librarian/types';

import FunctionType from './function';

const KindEnum = enumType({
  name: 'MethodKind',
  options: ['constructor', 'method'],
});

export default define('Method', {
  extends: FunctionType,
  properties: {
    kind: {type: KindEnum, default: 'method'},
    static: {type: booleanType, default: false},
  },
});
