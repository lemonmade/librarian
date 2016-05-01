import {
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLInt,
  GraphQLUnionType,
  GraphQLBoolean,
} from 'graphql';

import toGraphQL, {GRAPHQL} from './graphql';

export function optional(type) {
  function validate(val) { return val == null || type(val); }
  validate[GRAPHQL] = (...args) => toGraphQL(type, ...args);
  return validate;
}

export function nodeType(type) {
  function validate(val) { return val.type === type; }

  validate.node = type;
  validate[GRAPHQL] = (base) => toGraphQL(base.owner.get(type));

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

export function integerType(val) {
  return Number.isInteger(val);
}
integerType[GRAPHQL] = () => GraphQLInt;

export function identifierType(val) {
  return typeof val === 'string' && val.indexOf('id:') === 0;
}

export function oneOf(...types) {
  function validate(val) { return types.some((type) => type(val)); }
  validate[GRAPHQL] = (...args) => (
    new GraphQLUnionType({
      name: 'Union',
      types: types.map((type) => toGraphQL(type, ...args)),
    })
  );
  return validate;
}

export function arrayOf(type) {
  function validate(val) { return Array.isArray(val) && val.every((item) => type(item)); }
  validate[GRAPHQL] = (...args) => new GraphQLList(toGraphQL(type, ...args));
  return validate;
}
