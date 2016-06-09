import define from 'librarian/src/entities';
import {BooleanType, StringType, oneOfTypes} from 'librarian/src/types';

import FunctionType from './function';
import ValueType from './value';
import TypeType from './type';
import {basicProperties} from './common';

export default define({
  name: 'JavaScript:Member',
  properties: () => ({
    ...basicProperties,

    key: {type: ValueType},
    value: {
      type: oneOfTypes({
        name: 'JavaScript:Member:Value',
        types: [FunctionType, ValueType],
      }),
    },
    type: {type: TypeType, optional: true},
    static: {type: BooleanType, default: false},

    // computed

    name: {
      type: StringType,
      optional: true,
      get: (entity) => entity.key.value,
    },
    isStatic: {
      type: BooleanType,
      get: (entity) => entity.static,
    },
    isInstance: {
      type: BooleanType,
      get: (entity) => !entity.isStatic,
    },
    isMethod: {
      type: BooleanType,
      get: (entity) => FunctionType.check(entity.value),
    },
    isProperty: {
      type: BooleanType,
      get: (entity) => ValueType.check(entity.value),
    },
  }),
});
