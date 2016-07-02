import define from '../../../entities';
import {StringType} from '../../../types';

export default define({
  name: 'Param',
  source: 'Sass',
  properties: {
    name: {type: StringType},
  },
});
