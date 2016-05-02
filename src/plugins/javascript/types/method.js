import defineType from '../../../types/define';
import {booleanType, stringType, arrayOf, nodeType, enumType} from '../../../types/base';

import ParamType from './param';
import FunctionType from './function';

export default defineType('Method', {
  extends: FunctionType,
  properties: {
    name: {type: stringType},
    params: {type: arrayOf(nodeType(ParamType)), default: []},
    kind: {type: enumType('constructor', 'method'), default: 'method'},
    async: {type: booleanType, default: false},
    generator: {type: booleanType, default: false},
    static: {type: booleanType, default: false},
  },
});
