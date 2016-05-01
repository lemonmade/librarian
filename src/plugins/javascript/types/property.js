import defineType from '../../../types/define';
import {stringType, booleanType} from '../../../types/base';

export default defineType('Property', {
  properties: {
    name: {type: stringType, optional: true},
    static: {type: booleanType, default: false},
  },
});
