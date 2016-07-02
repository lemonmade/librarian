import {objectType, BooleanType, StringType, optional} from '../../../types';

export const ExportDetailsType = objectType({
  name: 'JavaScript:ExportDetails',
  fields: {
    default: {type: BooleanType},
    name: {type: optional(StringType)},
  },
});
