import define from 'librarian/src/entities';
import {arrayOfType, StringType, BooleanType, PrimitiveType} from 'librarian/src/types';

export default define({
  name: 'Component:Variation',
  source: 'Shopify',
  properties: {
    name: {type: StringType},
    description: {type: StringType, optional: true},
    default: {type: PrimitiveType, optional: true},
    required: {type: BooleanType, default: false},
    accepts: {type: arrayOfType(PrimitiveType), default: [true, false]},

    // computed

    isBoolean: {
      type: BooleanType,
      get: (entity) => (
        entity.accepts.length === 2 &&
        entity.accepts.indexOf(true) >= 0 &&
        entity.accepts.indexOf(false) >= 0
      ),
    },
    snippet: {
      type: StringType,
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
