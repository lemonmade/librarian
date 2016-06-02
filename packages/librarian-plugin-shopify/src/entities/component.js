import define from 'librarian/src/entities';
import {arrayOfType, StringType} from 'librarian/src/types';
import VariationType from './variation';

export default define({
  name: 'Shopify:Component',
  properties: {
    name: {type: StringType},
    helper: {type: StringType, optional: true},
    snippet: {type: StringType, optional: true},
    variations: {type: arrayOfType(VariationType)},
  },
});
