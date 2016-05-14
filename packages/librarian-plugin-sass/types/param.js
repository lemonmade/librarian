import define from 'librarian/entities';
import {stringType} from 'librarian/types';

export default define('Param', {
  properties: {
    name: {type: stringType},
  },
});
