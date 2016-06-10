import {GraphQLObjectType} from 'graphql';
import {matches} from 'lodash';

import FieldWrapper from './fields';
import {isProxy} from '../proxy';
import toGraphQL, {TO_GRAPHQL, graphQLName, toGraphQLArgs} from '../graphql';

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
    if (check(details)) { return details; }

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
  factory.isInputType = false;
  factory.isEntityType = true;

  function getGraphQLFields({inputOnly = false} = {}) {
    function graphQLDescriptorForField({name: fieldName, type}) {
      const result = {type: toGraphQL(type)};

      if (type.isArrayType && type.type.isEntityType) {
        result.args = toGraphQLArgs(type.type);
        result.resolve = (entity, args) => entity[fieldName].filter(matches(args));
      }

      return result;
    }

    return Object
      .values(fieldWrapper.fields)
      .filter((field) => !inputOnly || field.type.isInputType)
      .reduce((graphQLFields, field) => (
        {...graphQLFields, [field.name]: graphQLDescriptorForField(field)}
      ), {});
  }

  factory[TO_GRAPHQL] = ({argsOnly = false} = {}) => {
    if (argsOnly) {
      return getGraphQLFields({inputOnly: true});
    }

    return new GraphQLObjectType({
      name: graphQLName(name),
      description,
      fields: () => getGraphQLFields(),
      isTypeOf(obj) { return check(obj); },
    });
  };

  return factory;
}
