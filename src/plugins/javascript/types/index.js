import createTypeContainer from '../../../types/container';

import ClassType from './class';
import MethodType from './method';
import PropertyType from './property';
import ParamType from './param';

export default createTypeContainer('JavaScript', {
  types: [
    ClassType,
    MethodType,
    PropertyType,
    ParamType,
  ],
});
