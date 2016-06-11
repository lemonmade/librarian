import define from 'librarian/src/entities';
import {StringType} from 'librarian/src/types';

export default define({
  name: 'Param',
  source: 'Sass',
  properties: {
    name: {type: StringType},
  },
});
