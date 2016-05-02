import {GraphQLObjectType} from 'graphql';
import toGraphQL, {GRAPHQL} from './graphql';
import {optional} from './base';

export default function defineType(type, {
  properties = {},
  computed = {},
} = {}) {
  const base = {
    is(otherType) { return typeof otherType === 'function' ? otherType === factory : otherType === type; },
  };

  const defaults = {};
  const fields = {};

  Object
    .keys(computed)
    .forEach((key) => {
      const property = computed[key];

      fields[key] = {
        type: property.optional ? optional(property.type) : property.type,
        computed: true,
      };
      Object.defineProperty(base, key, {get: property.get});
    });

  Object
    .keys(properties)
    .forEach((key) => {
      const property = properties[key];

      fields[key] = {
        type: property.optional ? optional(property.type) : property.type,
        computed: false,
      };

      if (property.hasOwnProperty('default')) {
        defaults[key] = property.default;
      }
    });

  function factory(details = {}) {
    const finalDetails = {...defaults, ...details};
    validateFactoryArguments(finalDetails, fields);

    return Object
      .keys(finalDetails)
      .reduce((obj, key) => {
        obj[key] = finalDetails[key];
        return obj;
      }, Object.create(base));
  }

  factory.type = type;

  factory.matches = (val) => typeof val.is === 'function' && val.is(type);

  factory[GRAPHQL] = () => (new GraphQLObjectType({
    name: type,
    fields: Object
      .keys(fields)
      .reduce((graphQLFields, field) => {
        graphQLFields[field] = {type: toGraphQL(fields[field].type, factory)};
        return graphQLFields;
      }, {}),
    isTypeOf(obj) { return factory.matches(obj); },
  }));
  return factory;
}

function validateFactoryArguments(args, fields) {
  Object
    .keys(fields)
    .forEach((name) => {
      const field = fields[name];

      if (field.computed) {
        if (args.hasOwnProperty(name)) {
          throw new Error(`Unexpected assignment of computed property '${name}'`);
        }

        return;
      }

      if (!field.type(args[name])) {
        throw new Error(`Unexpected field value for '${name}'`);
      }
    });
}
