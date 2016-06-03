import define from 'librarian/src/entities';
import {StringType, arrayOfType, BooleanType, PrimitiveType} from 'librarian/src/types';
import TypeType from './type';
import ClassType from './class';
import {basicProperties, exportProperties} from './common';

const ValueType = define({
  name: 'JavaScript:Value',
  properties: () => ({
    ...basicProperties,
    ...exportProperties,
    name: {type: StringType},
    type: {type: TypeType, optional: true},
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
