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

import toGraphQL, {TO_GRAPHQL, graphQLName} from './graphql';

export function optional(type) {
  return {
    parse(val) { return val == null ? null : type.parse(val); },
    [TO_GRAPHQL]() { return toGraphQL(type); },
    check(val) { return val == null || type.check(val); },
    isInputType: type.isInputType,
  };
}

export const IdentifierType = {
  parse(val) { return String(val); },
  [TO_GRAPHQL]() { return GraphQLString; },
  check(val) { return typeof val === 'string' && val.indexOf('id:') === 0; },
  isInputType: true,
};

export const StringType = {
  parse(val) { return String(val); },
  [TO_GRAPHQL]() { return GraphQLString; },
  check(val) { return typeof val === 'string'; },
  isInputType: true,
};

export const NumberType = {
  parse(val) {
    const num = Number(val);
    return Number.isNaN(num) ? null : num;
  },
  [TO_GRAPHQL]() { return GraphQLFloat; },
  check(val) { return typeof val === 'number'; },
  isInputType: true,
};

export const BooleanType = {
  parse(val) { return Boolean(val); },
  [TO_GRAPHQL]() { return GraphQLBoolean; },
  check(val) { return typeof val === 'boolean'; },
  isInputType: true,
};

export const IntegerType = {
  parse(val) { return Number(val); },
  [TO_GRAPHQL]() { return GraphQLInt; },
  check(val) { return Number.isInteger(val); },
  isInputType: true,
};

export const PrimitiveType = {
  parse: serializePrimitive,
  [TO_GRAPHQL]() {
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
  isInputType: true,
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
    [TO_GRAPHQL]() {
      return new GraphQLUnionType({
        name: graphQLName(name),
        types: types.map((type) => toGraphQL(type)),
      });
    },
    check(val) {
      return types.some((type) => type.check(val));
    },
    isInputType: false,
  };
}

export function arrayOfType(type) {
  return {
    type: type,
    parse(val) { return Array.isArray(val) ? val.map(type.parse) : null; },
    [TO_GRAPHQL]() { return new GraphQLList(toGraphQL(type)); },
    check(val) { return Array.isArray(val) && val.every((item) => type.check(item)); },
    isInputType: false,
    isArrayType: true,
  };
}

export function enumType({name, options}) {
  function check(val) {
    return options.includes(val);
  }

  return {
    check,
    parse(val) { return check(val) ? val : null; },
    [TO_GRAPHQL]() {
      return new GraphQLEnumType({
        name: graphQLName(name),
        values: options.reduce((values, option) => {
          values[option] = {value: option};
          return values;
        }, {}),
      });
    },
    isInputType: false,
  };
}

export function objectType({name, fields}) {
  return {
    parse(val) { return typeof val === 'object' ? val : val; },
    [TO_GRAPHQL]() {
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
    isInputType: false,
  };
}

const PositionType = objectType({
  name: 'Position',
  fields: {
    line: {type: NumberType},
    column: {type: optional(NumberType)},
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
