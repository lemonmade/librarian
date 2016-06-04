import define from 'librarian/src/entities';
import {arrayOfType, BooleanType, PrimitiveType} from 'librarian/src/types';
import ClassType from './class';
import {basicProperties, exportProperties, memberProperties} from './common';

const ValueType = define({
  name: 'JavaScript:Value',
  properties: () => ({
    ...basicProperties,
    ...exportProperties,
    ...memberProperties,

    value: {type: PrimitiveType},
    class: {type: ClassType, optional: true},
    members: {type: arrayOfType(ValueType), default: []},
    isArray: {type: BooleanType, default: false},
    isObject: {type: BooleanType, default: false},

    // computed

    isClassInstance: {
      type: BooleanType,
      get: (entity) => entity.class != null,
    },
    isPrimitive: {
      type: BooleanType,
      get: (entity) => !entity.isClassInstance,
    },
  }),
});

export default ValueType;
