import define from 'librarian/src/entities';
import {StringType} from 'librarian/src/types';

import {basicProperties} from './common';

export default define({
  name: 'Placeholder',
  source: 'Sass',
  properties: {
    ...basicProperties,
    name: {type: StringType},
  },
});
