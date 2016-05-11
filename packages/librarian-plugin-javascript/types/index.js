import {objectType, booleanType, stringType, optional} from 'librarian/types';

export const exportDetailsType = objectType({
  name: 'ExportDetails',
  fields: {
    default: {type: booleanType},
    name: {type: optional(stringType)},
  },
});
