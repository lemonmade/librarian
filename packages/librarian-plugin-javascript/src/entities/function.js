import define from 'librarian/src/entities';
import {basicProperties, exportProperties, functionProperties} from './common';

export default define({
  name: 'JavaScript:Function',
  properties: {
    ...basicProperties,
    ...exportProperties,
    ...functionProperties,
  },
});
