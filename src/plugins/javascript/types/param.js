import defineType from '../../../types/define';
import {stringType} from '../../../types/base';

export default defineType('Param', {
  properties: {
    name: {type: stringType, optional: true},
  },
});
