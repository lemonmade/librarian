import {booleanType} from 'librarian/src/types';
import {exportDetailsType} from '../../types';

export default {
  export: {type: exportDetailsType, optional: true},

  // Computed
  isDefaultExport: {
    type: booleanType,
    get: (entity) => entity.export != null && entity.export.default,
  },
  isNamedExport: {
    type: booleanType,
    get: (entity) => entity.export != null && !entity.export.default,
  },
};
