import define from 'librarian/src/entities';
import {arrayOfType, BooleanType, PrimitiveType} from 'librarian/src/types';
import ClassType from './class';
import TypeType from './type';
import {basicProperties, memberProperties} from './common';

const ValueType = define({
  name: 'Value',
  source: 'ESNext',
  properties: () => ({
    ...basicProperties,
    ...memberProperties,

    value: {type: PrimitiveType},
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
