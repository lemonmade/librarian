import define from '../../../entities';
import {StringType} from '../../../types';

import {basicProperties} from './common';

export default define({
  name: 'Variable',
  source: 'Sass',
  properties: {
    ...basicProperties,
    name: {type: StringType},
  },
});
