import define from '../../../entities';
import {BooleanType, PrimitiveType} from '../../../types';

import {basicProperties} from './common';

const ValueType = define({
  name: 'Primitive',
  source: 'ESNext',
  properties: () => ({
    ...basicProperties,
    value: {type: PrimitiveType, optional: true},

    // Computed
    isString: {
      type: BooleanType,
      get: (entity) => typeof entity.value === 'string',
    },
    isNumber: {
      type: BooleanType,
      get: (entity) => typeof entity.value === 'number',
    },
    isBoolean: {
      type: BooleanType,
      get: (entity) => typeof entity.value === 'boolean',
    },
    isNull: {
      type: BooleanType,
      get: (entity) => entity.value === null,
    },
  }),
});

export default ValueType;
