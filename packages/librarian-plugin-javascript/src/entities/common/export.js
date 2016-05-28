import {BooleanType} from 'librarian/src/types';
import {ExportDetailsType} from '../../types';

export default {
  export: {type: ExportDetailsType, optional: true},

  // Computed
  isDefaultExport: {
    type: BooleanType,
    get: (entity) => entity.export != null && entity.export.default,
  },
  isNamedExport: {
    type: BooleanType,
    get: (entity) => entity.export != null && !entity.export.default,
  },
};
