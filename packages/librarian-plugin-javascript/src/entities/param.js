import define from 'librarian/src/entities';
import {stringType, nodeType, arrayOf, booleanType} from 'librarian/src/types';
import TypeType from './type';

const ParamType = define({
  name: 'JavaScript:Param',
  properties: () => ({
    name: {type: stringType, optional: true},
    properties: {type: arrayOf(nodeType(ParamType)), default: []},
    elements: {type: arrayOf(nodeType(ParamType)), default: []},
    spread: {type: booleanType, default: false},
    type: {type: nodeType(TypeType), optional: true},
    description: {type: stringType, optional: true},

    // Computed
    isObjectPattern: {
      type: booleanType,
      get: (entity) => entity.properties.length > 0,
    },
    isArrayPattern: {
      type: booleanType,
      get: (entity) => entity.elements.length > 0,
    },
  }),
});

export default ParamType;
