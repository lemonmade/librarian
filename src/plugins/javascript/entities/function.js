import define from '../../../entities';
import {StringType, arrayOfType, BooleanType} from '../../../types';

import ParamType from './param';
import TypeType from './type';
import {basicProperties, memberProperties} from './common';

export default define({
  name: 'Function',
  source: 'ESNext',
  properties: () => ({
    ...basicProperties,
    ...memberProperties,

    name: {type: StringType, optional: true},
    params: {type: arrayOfType(ParamType), default: []},
    async: {type: BooleanType, default: false},
    generator: {type: BooleanType, default: false},
    returns: {type: TypeType, optional: true},
  }),
});
