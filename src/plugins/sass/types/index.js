import createTypeContainer from '../../../types/container';

import MixinType from './mixin';
import ParamType from './param';

export default createTypeContainer('Sass', {
  types: [
    MixinType,
    ParamType,
  ],
});
