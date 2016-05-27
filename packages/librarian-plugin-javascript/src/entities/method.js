import define from 'librarian/src/entities';
import {booleanType, enumType} from 'librarian/src/types';
import {basicProperties} from './common';
import {properties as functionProperties} from './function';

export const METHOD = 'method';
export const CONSTRUCTOR = 'constructor';

const KindEnum = enumType({
  name: 'JavaScript:Method:Kind',
  options: [CONSTRUCTOR, METHOD],
});

export default define({
  name: 'JavaScript:Method',
  properties: {
    ...basicProperties,
    ...functionProperties,
    kind: {type: KindEnum, default: METHOD},
    static: {type: booleanType, default: false},
  },
});
