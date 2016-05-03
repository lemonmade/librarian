import {
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLInt,
  GraphQLUnionType,
  GraphQLBoolean,
  GraphQLEnumType,
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

export function enumType({name, types}) {
  function validate(val) { return types.some((type) => type === val); }
  validate[GRAPHQL] = () => (
    new GraphQLEnumType({
      name,
      values: types.reduce((values, type) => {
        values[type] = {value: type};
        return values;
      }, {}),
    })
  );
  return validate;
}
