import define from 'librarian/src/entities';
import {arrayOf, stringType, booleanType, primitiveType} from 'librarian/src/types';

export default define({
  name: 'Shopify:ComponentVariation',
  properties: {
    name: {type: stringType},
    description: {type: stringType, optional: true},
    default: {type: primitiveType, optional: true},
    required: {type: booleanType, default: false},
    accepts: {type: arrayOf(primitiveType), default: [true, false]},

    // computed

    isBoolean: {
      type: booleanType,
      get: (entity) => (
        entity.accepts.length === 2 &&
        entity.accepts.indexOf(true) >= 0 &&
        entity.accepts.indexOf(false) >= 0
      ),
    },
    snippet: {
      type: stringType,
      get: (entity) => {
        if (entity.isBoolean) {
          return `${entity.name}: ${entity.default ? 'false' : 'true'}`;
        } else {
          return `${entity.name}: \${1:${entity.accepts.length > 1 && entity.accepts[0] === entity.default ? entity.accepts[1] : entity.accepts[0]}}`;
        }
      },
    },
  },
});
