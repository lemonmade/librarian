import {
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLUnionType,
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLScalarType,
  Kind,
} from 'graphql';

import toGraphQL, {GRAPHQL, graphQLName} from './graphql';

export function optional(type) {
  return {
    parse(val) { return val == null ? null : type.parse(val); },
    [GRAPHQL]() { return toGraphQL(type); },
    check(val) { return val == null || type.check(val); },
  };
}

export function entityType(type) {
  return type;
}

export function connectionType(type) {
  return type;
}

export const IdentifierType = {
  parse(val) { return String(val); },
  [GRAPHQL]() { return GraphQLString; },
  check(val) { return typeof val === 'string' && val.indexOf('id:') === 0; },
};

export const StringType = {
  parse(val) { return String(val); },
  [GRAPHQL]() { return GraphQLString; },
  check(val) { return typeof val === 'string'; },
};

export const NumberType = {
  parse(val) {
    const num = Number(val);
    return Number.isNaN(num) ? null : num;
  },
  [GRAPHQL]() { return GraphQLFloat; },
  check(val) { return typeof val === 'number'; },
};

export const BooleanType = {
  parse(val) { return Boolean(val); },
  [GRAPHQL]() { return GraphQLBoolean; },
  check(val) { return typeof val === 'boolean'; },
};

export const IntegerType = {
  parse(val) { return Number(val); },
  [GRAPHQL]() { return GraphQLInt; },
  check(val) { return Number.isInteger(val); },
};

export const PrimitiveType = {
  parse: serializePrimitive,
  [GRAPHQL]() {
    return new GraphQLScalarType({
      name: 'Primitive',
      description: 'The scalar representing either a `Boolean`, `String`, or `Number`.',
      serialize: serializePrimitive,
      parseValue: serializePrimitive,
      parseLiteral(ast) {
        return [Kind.BOOLEAN, Kind.INT, Kind.Float, Kind.String].some((kind) => ast.kind === kind) ? ast.value : null;
      },
    });
  },
  check(val) {
    return StringType.check(val) || NumberType.check(val) || BooleanType.check(val);
  },
};

function serializePrimitive(val) {
  if (typeof val === 'boolean') {
    return Boolean(val);
  } else if (typeof val === 'string') {
    return String(val);
  } else if (typeof val === 'number') {
    return Number(val);
  } else {
    return null;
  }
}

export function oneOfTypes({name, types}) {
  return {
    parse(val) {
      const matchingType = types.find((type) => type.check(val));
      return matchingType ? matchingType.parse(val) : null;
    },
    [GRAPHQL]() {
      return new GraphQLUnionType({
        name: graphQLName(name),
        types: types.map((type) => toGraphQL(type)),
      });
    },
    check(val) {
      return types.some((type) => type.check(val));
    },
  };
}

export function arrayOfType(type) {
  return {
    parse(val) { return Array.isArray(val) ? val.map(type.parse) : null; },
    [GRAPHQL]() { return new GraphQLList(toGraphQL(type)); },
    check(val) { return Array.isArray(val) && val.every((item) => type.check(item)); },
  };
}

export function enumType({name, options}) {
  function check(val) {
    return options.includes(val);
  }

  return {
    check,
    parse(val) { return check(val) ? val : null; },
    [GRAPHQL]() {
      return new GraphQLEnumType({
        name: graphQLName(name),
        values: options.reduce((values, option) => {
          values[option] = {value: option};
          return values;
        }, {}),
      });
    },
  };
}

export function objectType({name, fields}) {
  return {
    parse(val) { return typeof val === 'object' ? val : val; },
    [GRAPHQL]() {
      return new GraphQLObjectType({
        name: graphQLName(name),
        fields: Object
          .keys(fields)
          .reduce((graphQLFields, fieldName) => ({
            ...graphQLFields,
            [fieldName]: {type: toGraphQL(fields[fieldName].type)},
          }), {}),
      });
    },
    check(val) {
      if (typeof val !== 'object' || Array.isArray(val)) { return false; }

      let valid = Object.keys(fields).every((field) => fields[field].type.check(val[field]));
      valid = valid && Object.keys(val).every((key) => fields.hasOwnProperty(key));
      return valid;
    },
  };
}

const PositionType = objectType({
  name: 'Position',
  fields: {
    line: {type: NumberType},
    column: {type: NumberType},
  },
});

export const LocationType = objectType({
  name: 'Location',
  fields: {
    file: {type: StringType},
    start: {type: PositionType},
    end: {type: PositionType},
  },
});
