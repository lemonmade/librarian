import define from 'librarian/src/entities';
import {arrayOf, stringType, booleanType, primitiveType} from 'librarian/src/types';

export default define('ShopifyVariation', {
  properties: {
    name: {type: stringType},
    description: {type: stringType, optional: true},
    default: {type: primitiveType, optional: true},
    required: {type: booleanType, default: false},
    accepts: {type: arrayOf(primitiveType), default: [true, false]},
  },
});
