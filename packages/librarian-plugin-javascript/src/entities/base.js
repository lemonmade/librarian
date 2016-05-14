import define from 'librarian/src/entities';
import {stringType, booleanType, locationType} from 'librarian/src/types';
import {exportDetailsType} from '../types';

export default define('Base', {
  properties: {
    location: {type: locationType},
    export: {type: exportDetailsType, optional: true},
    description: {type: stringType, optional: true},
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
