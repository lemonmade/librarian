import define from 'librarian/src/entities';
import {stringType, booleanType, arrayOf, nodeType} from 'librarian/src/types';

const TypeType = define({
  name: 'JavaScript:Type',
  properties: () => ({
    type: {type: stringType, optional: true},
    types: {type: arrayOf(nodeType(TypeType)), default: []},
    union: {type: booleanType, default: false},
    intersection: {type: booleanType, default: false},
    // eslint-disable-next-line no-use-before-define
    properties: {type: arrayOf(nodeType(TypePropertyType)), default: []},
    elements: {type: arrayOf(nodeType(TypeType)), default: []},
    nullable: {type: booleanType, default: false},

    // Computed
    isObjectType: {
      type: booleanType,
      get: (entity) => entity.properties.length > 0,
    },
    isArrayType: {
      type: booleanType,
      get: (entity) => entity.elements.length > 0,
    },
  }),
});

export default TypeType;

export const TypePropertyType = define({
  name: 'JavaScript:Type:Property',
  properties: () => ({
    name: {type: stringType},
    type: {type: nodeType(TypeType)},
  }),
});
