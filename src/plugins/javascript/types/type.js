import defineType from '../../../types/define';
import {stringType, booleanType, arrayOf, nodeType} from '../../../types/base';

const TypeType = defineType('Type', {
  properties: () => ({
    type: {type: stringType, optional: true},
    types: {type: arrayOf(nodeType(TypeType)), default: []},
    union: {type: booleanType, default: false},
    intersection: {type: booleanType, default: false},
    // eslint-disable-next-line no-use-before-define
    properties: {type: arrayOf(nodeType(TypePropertyType)), default: []},
    elements: {type: arrayOf(nodeType(TypeType)), default: []},
    nullable: {type: booleanType, default: false},
  }),

  computed: {
    isObjectType: {
      type: booleanType,
      get() { return this.properties.length > 0; },
    },
    isArrayType: {
      type: booleanType,
      get() { return this.elements.length > 0; },
    },
  },
});

export default TypeType;

export const TypePropertyType = defineType('TypeProperty', {
  properties: () => ({
    name: {type: stringType},
    type: {type: nodeType(TypeType)},
  }),
});
