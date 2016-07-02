import define from '../../../entities';
import {StringType, arrayOfType, LocationType} from '../../../types';

import ParamType from './param';
import {basicProperties} from './common';

export default define({
  name: 'Mixin',
  source: 'Sass',
  properties: {
    ...basicProperties,
    name: {type: StringType},
    params: {type: arrayOfType(ParamType), default: []},
  },
});
