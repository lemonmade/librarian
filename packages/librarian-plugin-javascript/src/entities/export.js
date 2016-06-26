import define from 'librarian/src/entities';
import {BooleanType, StringType, oneOfTypes} from 'librarian/src/types';

import {getValueEntities} from './value-entity';

let ExportValueType;

export default define({
  name: 'Export',
  source: 'ESNext',
  properties: () => {
    // TODO: add the ability to define these as thunks
    ExportValueType = ExportValueType || oneOfTypes({
      name: 'ESNext:Export:Value',
      types: getValueEntities(),
    });

    return {
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
    };
  },
});
