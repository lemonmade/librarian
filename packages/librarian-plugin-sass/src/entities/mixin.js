import define from 'librarian/src/entities';
import {StringType, arrayOfType} from 'librarian/src/types';
import ParamType from './param';

export default define({
  name: 'Sass:Mixin',
  properties: {
    name: {type: StringType},
    description: {type: StringType, optional: true},
    params: {type: arrayOfType(ParamType), default: []},
  },
});
