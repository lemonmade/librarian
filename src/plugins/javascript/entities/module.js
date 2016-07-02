import define from '../../../entities';
import {StringType, arrayOfType} from '../../../types';

import ExportType from './export';

export default define({
  name: 'Module',
  source: 'ESNext',
  properties: () => ({
    name: {type: StringType},
    exports: {type: arrayOfType(ExportType), default: []},

    // computed

    defaultExport: {
      type: ExportType,
      optional: true,
      get: (entity) => entity.exports.find((anExport) => anExport.isDefaultExport),
    },
  }),
});
