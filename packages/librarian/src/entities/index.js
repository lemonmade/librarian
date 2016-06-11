import {GraphQLObjectType} from 'graphql';
import {matches} from 'lodash';

import FieldWrapper from './fields';
import {isProxy} from '../proxy';
import toGraphQL, {TO_GRAPHQL, graphQLName, toGraphQLArgs} from '../graphql';
import createID from '../id';

const IS_ENTITY = Symbol('isEntity');
const ENTITY_TYPE = Symbol('entityType');

export function isEntity(val) {
  return Boolean(val && val[IS_ENTITY]);
}

export default function define({
  name,
  source,
  description,
  properties = {},
} = {}) {
  const fieldWrapper = new FieldWrapper(properties);
  const finalName = `${source}:${name}`;

  function check(val) {
    return isProxy(val) || (isEntity(val) && val[ENTITY_TYPE] === finalName);
  }

  let id = 1;
  function uniqueID() { return createID(`${finalName}:${id++}`); }

  let base;
  function factory(details = {}) {
    if (check(details)) { return details; }

    base = base || Object.create(fieldWrapper.baseObject, {
      [ENTITY_TYPE]: {value: finalName},
      [IS_ENTITY]: {value: true},
    });

    const finalDetails = {...fieldWrapper.defaults, ...details};
    if (!fieldWrapper.field('id').computed && finalDetails.id == null) {
      finalDetails.id = uniqueID();
    }

    fieldWrapper.validate(finalDetails);

    return Object
      .entries(finalDetails)
      .filter(([field]) => fieldWrapper.includes(field))
      .reduce((obj, [field, value]) => {
        obj[field] = fieldWrapper.field(field).type.parse(value);
        return obj;
      }, Object.create(base, {
        __source: {value: source},
        __type: {value: finalName},
      }));
  }

  factory.check = check;
  factory.parse = factory;
  factory[ENTITY_TYPE] = finalName;
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
      name: graphQLName(finalName),
      description,
      fields: () => getGraphQLFields(),
      isTypeOf(obj) { return check(obj); },
    });
  };

  return factory;
}
