import define from 'librarian/src/entities';
import {StringType, arrayOfType, BooleanType, PrimitiveType} from 'librarian/src/types';
import TypeType from './type';

const ParamType = define({
  name: 'Param',
  source: 'ESNext',
  properties: () => ({
    name: {type: StringType, optional: true},
    properties: {type: arrayOfType(ParamType), default: []},
    default: {type: PrimitiveType, optional: true},
    elements: {type: arrayOfType(ParamType), default: []},
    spread: {type: BooleanType, default: false},
    type: {type: TypeType, optional: true},
    description: {type: StringType, optional: true},

    // Computed
    isObjectPattern: {
      type: BooleanType,
      get: (entity) => entity.properties.length > 0,
    },
    isArrayPattern: {
      type: BooleanType,
      get: (entity) => entity.elements.length > 0,
    },
  }),
});

export default ParamType;
