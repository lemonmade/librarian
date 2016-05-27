import {GraphQLObjectType} from 'graphql';
import toGraphQL, {GRAPHQL} from '../types/graphql';
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
  name: type,
  description,
  properties = {},
} = {}) {
  const fieldWrapper = new FieldWrapper(properties);

  function factory(details = {}) {
    // if (factory.check(details)) { return details; }
    const finalDetails = {...fieldWrapper.defaults, ...details};
    fieldWrapper.validate(finalDetails);
    const base = Object.create(fieldWrapper.baseObject, {
      __type: {value: type, enumerable: true},
    });

    return Object
      .entries(finalDetails)
      .filter(([field]) => fieldWrapper.includes(field))
      .reduce((obj, [field, value]) => ({...obj, [field]: value}), base);
  }

  factory.type = type;
  factory.check = (val) => val.__type === type;

  factory[GRAPHQL] = () => (new GraphQLObjectType({
    name: type.replace(/:/g, ''),
    description,
    fields: () => (
      Object
        .values(fieldWrapper.fields)
        .reduce((graphQLFields, field) => (
          {...graphQLFields, [field.name]: {type: toGraphQL(field.type)}}
        ), {})
    ),
    isTypeOf(obj) { return factory.check(obj); },
  }));

  return factory;
}
