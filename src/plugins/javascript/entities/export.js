import define from '../../../entities';
import {BooleanType, StringType, oneOfTypes} from '../../../types';

import {getValueEntities} from './value-entity';

const ExportValueType = oneOfTypes({
  name: 'ESNext:Export:Value',
  types: getValueEntities,
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
