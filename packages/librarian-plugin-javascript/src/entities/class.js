import define from 'librarian/src/entities';
import {StringType} from 'librarian/src/types';

import {basicProperties, exportProperties, memberProperties} from './common';
import FunctionType from './function';

const ClassType = define({
  name: 'JavaScript:Class',
  properties: () => ({
    ...basicProperties,
    ...exportProperties,
    ...memberProperties,

    name: {type: StringType, optional: true},
    extends: {type: ClassType, optional: true},
    ctor: {type: FunctionType, optional: true},
  }),
});

export default ClassType;
