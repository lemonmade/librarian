import define from 'librarian/entities';
import {booleanType, locationType} from 'librarian/types';
import {exportDetailsType} from '../types';

export default define('Base', {
  properties: {
    location: {type: locationType},
    export: {type: exportDetailsType, optional: true},
  },
  computed: {
    isDefaultExport: {
      type: booleanType,
      get() { return this.export != null && this.export.default; },
    },
    isNamedExport: {
      type: booleanType,
      get() { return this.export != null && !this.export.default; },
    },
  },
});
