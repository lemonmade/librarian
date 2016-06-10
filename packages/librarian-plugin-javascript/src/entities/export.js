import define from 'librarian/src/entities';
import {BooleanType, StringType, oneOfTypes} from 'librarian/src/types';

import FunctionType from './function';
import ClassType from './class';
import ValueType from './value';

const ExportValueType = oneOfTypes({
  name: 'JavaScript:Export:Value',
  types: [FunctionType, ValueType, ClassType],
});

export default define({
  name: 'JavaScript:Export',
  properties: () => ({
    name: {type: StringType, default: 'default'},
    value: {type: ExportValueType},

    // computed

    isDefaultExport: {
      type: BooleanType,
      get: (entity) => entity.name === 'default',
    },
    isNamedExport: {
      type: BooleanType,
      get: (entity) => !entity.isDefaultExport,
    },
  }),
});
