import defineType from '../../../types/define';
import {stringType, nodeType, arrayOf, booleanType} from '../../../types/base';

const ParamType = defineType('Param', {
  properties: () => ({
    name: {type: stringType, optional: true},
    properties: {type: arrayOf(nodeType(ParamType)), default: []},
    elements: {type: arrayOf(nodeType(ParamType)), default: []},
    spread: {type: booleanType, default: false},
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
