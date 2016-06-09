import {GraphQLObjectType} from 'graphql';

import FieldWrapper from './fields';
import {isProxy} from '../proxy';
import toGraphQL, {TO_GRAPHQL, graphQLName} from '../graphql';

const IS_ENTITY = Symbol('isEntity');
const ENTITY_TYPE = Symbol('entityType');

export function isEntity(val) {
  return Boolean(val && val[IS_ENTITY]);
}

export default function define({
  name,
  description,
  properties = {},
} = {}) {
  const fieldWrapper = new FieldWrapper(properties);

  function check(val) {
    return isProxy(val) || (isEntity(val) && val[ENTITY_TYPE] === name);
  }

  let id = 1;
  function uniqueID() { return `id:${name}:${id++}`; }

  let base;
  function factory(details = {}) {
    if (isProxy(details)) { return details; }

    base = base || Object.create(fieldWrapper.baseObject, {
      [ENTITY_TYPE]: {value: name},
      [IS_ENTITY]: {value: true},
    });

    const finalDetails = {id: uniqueID(), ...fieldWrapper.defaults, ...details};
    fieldWrapper.validate(finalDetails);

    return Object
      .entries(finalDetails)
      .filter(([field]) => fieldWrapper.includes(field))
      .reduce((obj, [field, value]) => {
        obj[field] = fieldWrapper.field(field).type.parse(value);
        return obj;
      }, Object.create(base));
  }

  factory.check = check;
  factory.parse = factory;
  factory[ENTITY_TYPE] = name;

  factory[TO_GRAPHQL] = () => (new GraphQLObjectType({
    name: graphQLName(name),
    description,
    fields: () => (
      Object
        .values(fieldWrapper.fields)
        .reduce((graphQLFields, field) => (
          {...graphQLFields, [field.name]: {type: toGraphQL(field.type)}}
        ), {})
    ),
    isTypeOf(obj) { return check(obj); },
  }));

  return factory;
}
