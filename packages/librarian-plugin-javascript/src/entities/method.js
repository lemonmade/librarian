import define from 'librarian/src/entities';
import {BooleanType, enumType} from 'librarian/src/types';
import {basicProperties, functionProperties} from './common';

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
    static: {type: BooleanType, default: false},
  },
});
