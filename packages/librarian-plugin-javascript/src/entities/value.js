import define from 'librarian/src/entities';
import {arrayOfType, BooleanType, PrimitiveType, StringType} from 'librarian/src/types';
import ClassType from './class';
import TypeType from './type';
import {basicProperties, exportProperties, memberProperties} from './common';

const ValueType = define({
  name: 'JavaScript:Value',
  properties: () => ({
    ...basicProperties,
    ...exportProperties,
    ...memberProperties,

    value: {type: PrimitiveType},
    name: {type: StringType, optional: true},
    type: {type: TypeType, optional: true},
    class: {type: ClassType, optional: true},
    members: {type: arrayOfType(ValueType), default: []},

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
