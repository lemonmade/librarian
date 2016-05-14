import define from 'librarian/src/entities';
import {stringType, nodeType, arrayOf, booleanType} from 'librarian/src/types';
import TypeType from './type';

const ParamType = define('Param', {
  properties: () => ({
    name: {type: stringType, optional: true},
    properties: {type: arrayOf(nodeType(ParamType)), default: []},
    elements: {type: arrayOf(nodeType(ParamType)), default: []},
    spread: {type: booleanType, default: false},
    type: {type: nodeType(TypeType), optional: true},
  }),
  computed: {
    isObjectPattern: {
      type: booleanType,
      get() { return this.properties.length > 0; },
    },
    isArrayPattern: {
      type: booleanType,
      get() { return this.elements.length > 0; },
    },
  },
});

export default ParamType;
