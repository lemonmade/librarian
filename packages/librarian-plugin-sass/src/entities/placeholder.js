import define from 'librarian/src/entities';
import {StringType} from 'librarian/src/types';

import {basicProperties} from './common';

export default define({
  name: 'Sass:Placeholder',
  properties: {
    ...basicProperties,
    name: {type: StringType},
  },
});
