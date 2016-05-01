import defineType from '../../../types/define';
import {stringType, nodeType, arrayOf, booleanType} from '../../../types/base';

export default defineType('Function', {
  properties: {
    name: {type: stringType},
    params: {type: arrayOf(nodeType('Param')), default: []},
    async: {type: booleanType, default: false},
    generator: {type: booleanType, default: false},
  },
});
