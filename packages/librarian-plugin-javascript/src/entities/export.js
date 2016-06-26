import define from 'librarian/src/entities';
import {BooleanType, StringType, oneOfTypes} from 'librarian/src/types';

import FunctionType from './function';
import ClassType from './class';
import ValueType from './value';

import ComponentType from './component';

const ExportValueType = oneOfTypes({
  name: 'ESNext:Export:Value',
  types: [FunctionType, ValueType, ClassType, ComponentType],
});

export default define({
  name: 'Export',
  source: 'ESNext',
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
