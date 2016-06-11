import define from 'librarian/src/entities';
import {StringType} from 'librarian/src/types';

import {basicProperties, memberProperties} from './common';
import FunctionType from './function';

const ClassType = define({
  name: 'Class',
  source: 'ESNext',
  properties: () => ({
    ...basicProperties,
    ...memberProperties,

    name: {type: StringType, optional: true},
    extends: {type: ClassType, optional: true},
    ctor: {type: FunctionType, optional: true},
  }),
});

export default ClassType;
