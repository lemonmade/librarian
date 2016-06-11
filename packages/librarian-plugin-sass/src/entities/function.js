import define from 'librarian/src/entities';
import {StringType, arrayOfType, LocationType} from 'librarian/src/types';

import ParamType from './param';
import {basicProperties} from './common';

export default define({
  name: 'Function',
  source: 'Sass',
  properties: {
    ...basicProperties,
    name: {type: StringType},
    params: {type: arrayOfType(ParamType), default: []},
  },
});
