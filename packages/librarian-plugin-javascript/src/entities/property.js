import define from 'librarian/src/entities';
import {stringType, booleanType, locationType} from 'librarian/src/types';
import {basicProperties} from './common';

export default define({
  name: 'JavaScript:Property',
  properties: {
    ...basicProperties,
    name: {type: stringType, optional: true},
    static: {type: booleanType, default: false},
    location: {type: locationType},
  },
});
