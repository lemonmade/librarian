import {GraphQLObjectType} from 'graphql';
import toGraphQL, {GRAPHQL, graphQLName} from '../types/graphql';
import FieldWrapper from './fields';
import {EntityProxy} from './proxy';

export default function define({
  name,
  description,
  properties = {},
} = {}) {
  const fieldWrapper = new FieldWrapper(properties);

  function check(val) {
    return val instanceof EntityProxy || val.__type === name;
  }

  let base;
  function factory(details = {}) {
    base = base || Object.create(fieldWrapper.baseObject, {
      __type: {value: name, enumerable: true},
    });

    const finalDetails = {...fieldWrapper.defaults, ...details};
    fieldWrapper.validate(finalDetails);

    return Object
      .entries(finalDetails)
      .filter(([field]) => fieldWrapper.includes(field))
      .reduce((obj, [field, value]) => {
        obj[field] = fieldWrapper.field(field).type.parse(value);
        return obj;
      }, Object.create(base, {
        __type: {value: name, enumerable: true},
      }));
  }

  factory.check = check;
  factory.parse = factory;
  factory.type = name;

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
