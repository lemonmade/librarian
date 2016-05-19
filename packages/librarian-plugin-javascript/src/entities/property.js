import define from 'librarian/src/entities';
import {stringType, booleanType, locationType} from 'librarian/src/types';

export default define('JavaScriptProperty', {
  properties: {
    name: {type: stringType, optional: true},
    static: {type: booleanType, default: false},
    location: {type: locationType},
  },
});
