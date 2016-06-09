import define from 'librarian/src/entities';
import {StringType} from 'librarian/src/types';

export default define({
  name: 'Sass:Param',
  properties: {
    name: {type: StringType},
  },
});
