import define from 'librarian/src/entities';
import {arrayOf, stringType, nodeType} from 'librarian/src/types';
import VariationType from './variation';

export default define({
  name: 'Shopify:Component',
  properties: {
    name: {type: stringType},
    helper: {type: stringType, optional: true},
    snippet: {type: stringType, optional: true},
    variations: {type: arrayOf(nodeType(VariationType))},
  },
});
