import defineType from '../../../types/define';
import {stringType, nodeType, arrayOf} from '../../../types/base';
import ParamType from './param';

export default defineType('Param', {
  properties: {
    name: {type: stringType, optional: true},
    params: {type: arrayOf(nodeType(ParamType)), default: []},
  },
});
