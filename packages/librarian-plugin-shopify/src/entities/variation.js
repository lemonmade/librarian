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
  computed: {
    isBoolean: {
      type: booleanType,
      get() {
        return (
          this.accepts.length === 2 &&
          this.accepts.indexOf(true) >= 0 &&
          this.accepts.indexOf(false) >= 0
        );
      },
    },
    snippet: {
      type: stringType,
      get() {
        if (this.isBoolean) {
          return `${this.name}: ${this.default ? 'false' : 'true'}`;
        } else {
          return `${this.name}: \${1:${this.accepts.length > 1 && this.accepts[0] === this.default ? this.accepts[1] : this.accepts[0]}}`;
        }
      },
    },
  },
});
