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

import toGraphQL, {GRAPHQL} from './graphql';

export function optional(type) {
  function validate(val) { return val == null || type(val); }
  validate[GRAPHQL] = () => toGraphQL(type);
  return validate;
}

export function nodeType(type) {
  function validate(val) { return type.check(val); }
  validate[GRAPHQL] = () => toGraphQL(type);
  return validate;
}

function valueType(type) {
  return (val) => typeof val === type;
}

export const stringType = valueType('string');
stringType[GRAPHQL] = () => GraphQLString;

export const numberType = valueType('number');
numberType[GRAPHQL] = () => GraphQLFloat;

export const booleanType = valueType('boolean');
booleanType[GRAPHQL] = () => GraphQLBoolean;

export function primitiveType(val) {
  return stringType(val) || numberType(val) || booleanType(val);
}

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

primitiveType[GRAPHQL] = () => (
  new GraphQLScalarType({
    name: 'Primitive',
    description: 'The scalar representing either a `Boolean`, `String`, or `Number`.',
    serialize: serializePrimitive,
    parseValue: serializePrimitive,
    parseLiteral(ast) {
      return [Kind.BOOLEAN, Kind.INT, Kind.Float, Kind.String].some((kind) => ast.kind === kind) ? ast.value : null;
    },
  })
);

export function integerType(val) {
  return Number.isInteger(val);
}
integerType[GRAPHQL] = () => GraphQLInt;

export function identifierType(val) {
  return typeof val === 'string' && val.indexOf('id:') === 0;
}

export function oneOf({name, types}) {
  function validate(val) { return types.some((type) => type(val)); }
  validate[GRAPHQL] = () => (
    new GraphQLUnionType({
      name,
      types: types.map((type) => toGraphQL(type)),
    })
  );
  return validate;
}

export function arrayOf(type) {
  function validate(val) { return Array.isArray(val) && val.every((item) => type(item)); }
  validate[GRAPHQL] = () => new GraphQLList(toGraphQL(type));
  return validate;
}

export function enumType({name, options}) {
  function validate(val) { return options.some((type) => type === val); }
  validate[GRAPHQL] = () => (
    new GraphQLEnumType({
      name,
      values: options.reduce((values, option) => {
        values[option] = {value: option};
        return values;
      }, {}),
    })
  );
  return validate;
}

export function objectType({name, fields}) {
  function validate(val) {
    if (val == null || typeof val !== 'object' || Array.isArray(val)) { return false; }

    let valid = Object.keys(fields).every((field) => fields[field].type(val[field]));
    valid = valid && Object.keys(val).every((key) => fields.hasOwnProperty(key));
    return valid;
  }

  validate[GRAPHQL] = () => (
    new GraphQLObjectType({
      name,
      fields: Object
        .keys(fields)
        .reduce((graphQLFields, fieldName) => ({
          ...graphQLFields,
          [fieldName]: {type: toGraphQL(fields[fieldName].type)},
        }), {}),
    })
  );

  return validate;
}

const positionType = objectType({
  name: 'Position',
  fields: {
    line: {type: numberType},
    column: {type: numberType},
  },
});

export const locationType = objectType({
  name: 'Location',
  fields: {
    file: {type: stringType},
    start: {type: positionType},
    end: {type: positionType},
  },
});
