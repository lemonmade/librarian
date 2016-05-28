import define from 'librarian/src/entities';
import {StringType, BooleanType, LocationType} from 'librarian/src/types';
import {basicProperties} from './common';

export default define({
  name: 'JavaScript:Property',
  properties: {
    ...basicProperties,
    name: {type: StringType, optional: true},
    static: {type: BooleanType, default: false},
    location: {type: LocationType},
  },
});
