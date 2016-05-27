import {GraphQLObjectType} from 'graphql';
import toGraphQL, {GRAPHQL, graphQLName} from '../types/graphql';
import FieldWrapper from './field-wrapper';

export function identifier({name, module, memberOf, static: isStatic}) {
  let id = `${module}.`;
  if (memberOf) {
    id += memberOf;
    id += isStatic ? '.' : '#';
  }

  return `${id}${name}`;
}

export default function define({
  name,
  description,
  properties = {},
} = {}) {
  const fieldWrapper = new FieldWrapper(properties);

  function check(val) {
    return val.__type === name;
  }

  let base;
  function factory(details = {}) {
    base = base || Object.create(fieldWrapper.baseObject, {
      __type: {value: name, enumerable: true},
    });

    // We are already pre-constructed, no need to go through all the logic again.
    // Just add the computed properties if they are missing and return.
    if (check(details)) {
      return Object.getPrototypeOf(details) === base
        ? details
        : Object.create(base, Object.getOwnPropertyDescriptors(details));
    }

    const finalDetails = {...fieldWrapper.defaults, ...details};
    fieldWrapper.validate(finalDetails);

    return Object
      .entries(finalDetails)
      .filter(([field]) => fieldWrapper.includes(field))
      .reduce((obj, [field, value]) => ({
        ...obj,
        [field]: fieldWrapper.field(field).type.parse(value),
      }), base);
  }

  factory.check = check;
  factory.parse = factory;

  factory[GRAPHQL] = () => (new GraphQLObjectType({
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
