import define from 'librarian/src/entities';
import {StringType, arrayOfType, BooleanType} from 'librarian/src/types';

import ParamType from './param';
import TypeType from './type';
import {basicProperties, exportProperties, memberProperties} from './common';

export default define({
  name: 'JavaScript:Function',
  properties: () => ({
    ...basicProperties,
    ...exportProperties,
    ...memberProperties,

    name: {type: StringType, optional: true},
    params: {type: arrayOfType(ParamType), default: []},
    async: {type: BooleanType, default: false},
    generator: {type: BooleanType, default: false},
    returns: {type: TypeType, optional: true},
  }),
});
