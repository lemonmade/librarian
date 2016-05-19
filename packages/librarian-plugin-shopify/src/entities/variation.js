import define from 'librarian/src/entities';
import {arrayOf, stringType, booleanType, numberType, oneOf} from 'librarian/src/types';

const possibleTypes = oneOf({
  name: 'ShopifyVariationPossibleType',
  types: [arrayOf(stringType), arrayOf(booleanType), arrayOf(numberType)],
});

export default define('ShopifyVariation', {
  properties: {
    name: {type: stringType},
    description: {type: stringType, optional: true},
    // default: {type: possibleTypes, optional: true},
    required: {type: booleanType, default: false},
    // accepts: {type: possibleTypes, default: [true, false]},
  },
});
