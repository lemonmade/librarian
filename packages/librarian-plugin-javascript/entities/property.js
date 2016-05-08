import define from 'librarian/entities';
import {stringType, booleanType, locationType} from 'librarian/types';

export default define('Property', {
  properties: {
    name: {type: stringType, optional: true},
    static: {type: booleanType, default: false},
    location: {type: locationType},
  },
});
