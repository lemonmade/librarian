import defineType from '../../../types/define';
import {booleanType} from '../../../types/base';

export default defineType('Method', {
  extends: 'Function',
  properties: {
    static: {type: booleanType, default: false},
  },
});
