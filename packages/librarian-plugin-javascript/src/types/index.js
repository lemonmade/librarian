import {objectType, BooleanType, StringType, optional} from 'librarian/src/types';

export const ExportDetailsType = objectType({
  name: 'ExportDetails',
  fields: {
    default: {type: BooleanType},
    name: {type: optional(StringType)},
  },
});
