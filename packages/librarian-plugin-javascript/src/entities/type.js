import define from 'librarian/src/entities';
import {StringType, BooleanType, arrayOfType} from 'librarian/src/types';

const TypeType = define({
  name: 'Type',
  source: 'ESNext',
  properties: () => ({
    type: {type: StringType, optional: true},
    types: {type: arrayOfType(TypeType), default: []},
    union: {type: BooleanType, default: false},
    intersection: {type: BooleanType, default: false},
    // eslint-disable-next-line no-use-before-define
    properties: {type: arrayOfType(TypePropertyType), default: []},
    elements: {type: arrayOfType(TypeType), default: []},
    nullable: {type: BooleanType, default: false},

    // Computed
    isObjectType: {
      type: BooleanType,
      get: (entity) => entity.properties.length > 0,
    },
    isArrayType: {
      type: BooleanType,
      get: (entity) => entity.elements.length > 0,
    },
  }),
});

export default TypeType;

export const TypePropertyType = define({
  name: 'Type:Property',
  source: 'ESNext',
  properties: () => ({
    name: {type: StringType},
    type: {type: TypeType},
  }),
});
