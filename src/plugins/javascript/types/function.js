import defineType from '../../../types/define';
import {stringType, nodeType, arrayOf, booleanType} from '../../../types/base';
import ParamType from './param';
import TypeType from './type';

export default defineType('Function', {
  properties: {
    name: {type: stringType},
    params: {type: arrayOf(nodeType(ParamType)), default: []},
    async: {type: booleanType, default: false},
    generator: {type: booleanType, default: false},
    returns: {type: nodeType(TypeType), optional: true},
  },
});
