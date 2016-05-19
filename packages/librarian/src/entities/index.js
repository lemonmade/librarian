import {GraphQLObjectType} from 'graphql';
import toGraphQL, {GRAPHQL} from '../types/graphql';
import {optional} from '../types';

class FieldWrapper {
  constructor(properties, computed) {
    this.properties = [properties];
    this.computed = [computed];
  }

  resolve() {
    this.properties = this.properties.map((properties) => (
      typeof properties === 'function' ? properties() : properties
    ));

    this.computed = this.computed.map((computed) => (
      typeof computed === 'function' ? computed() : computed
    ));
  }

  validate(obj) {
    this.forEach((field) => {
      const {name} = field;

      if (field.computed) {
        if (obj.hasOwnProperty(name)) {
          throw new Error(`Unexpected assignment of computed property '${name}'`);
        }

        return;
      }

      // console.log(obj);
      if (!field.type(obj[name])) {
        throw new Error(`Unexpected field value for '${name}' (${obj[name]})`);
      }
    });
  }

  createBaseObject(base) {
    this.forEach((field) => {
      if (!field.computed) { return; }
      Object.defineProperty(base, field.name, {get: field.get});
    });

    return base;
  }

  augmentWithDefaults(obj) {
    return {...this.defaults, ...obj};
  }

  reduce(...args) {
    return this.fields.reduce(...args);
  }

  forEach(...args) {
    return this.fields.forEach(...args);
  }

  includes(fieldName) {
    return this.fields.some((field) => field.name === fieldName);
  }

  augmentWithFields(fields) {
    this.properties = [...fields.properties, ...this.properties];
    this.computed = [...fields.computed, ...this.computed];
  }

  get fields() {
    this.resolve();
    const {properties, computed} = this;
    const fields = [
      ...properties.reduce((allProperties, someProperties) => [
        ...allProperties,
        ...Object.keys(someProperties).map((field) => {
          const property = someProperties[field];
          return {
            name: field,
            type: property.optional ? optional(property.type) : property.type,
            computed: false,
          };
        }),
      ], []),

      ...computed.reduce((allComputed, someComputed) => [
        ...allComputed,
        ...Object.keys(someComputed).map((field) => {
          const property = someComputed[field];
          return {
            name: field,
            type: property.optional ? optional(property.type) : property.type,
            get: property.get,
            computed: true,
          };
        }),
      ], []),
    ];

    Object.defineProperty(this, 'fields', {value: fields});
    return fields;
  }

  get defaults() {
    this.resolve();
    const {properties} = this;

    const defaults = properties.reduce((allProperties, someProperties) => ({
      ...allProperties,
      ...Object
        .keys(someProperties)
        .reduce((allDefaults, field) => {
          const property = someProperties[field];
          if (property.hasOwnProperty('default')) {
            allDefaults[field] = property.default;
          }

          return allDefaults;
        }, {}),
    }), {});

    Object.defineProperty(this, 'defaults', {value: defaults});
    return defaults;
  }
}

export default function define(type, {
  extends: extendsType,
  properties = {},
  computed = {},
} = {}) {
  let base;
  const fields = new FieldWrapper(properties, computed);

  if (extendsType != null) {
    fields.augmentWithFields(extendsType.fields);
  }

  function factory(details = {}) {
    // if (factory.check(details)) { return details; }
    const finalDetails = fields.augmentWithDefaults(details);
    fields.validate(finalDetails);

    if (base == null) {
      base = fields.createBaseObject({
        is(otherType) {
          return typeof otherType === 'function' ? otherType === factory : otherType === type;
        },
      });
    }

    return Object
      .keys(finalDetails)
      .filter((key) => fields.includes(key))
      .reduce((obj, key) => {
        obj[key] = finalDetails[key];
        return obj;
      }, Object.create(base, {__type: {value: type, enumerable: true}}));
  }

  factory.fields = fields;
  factory.type = type;
  factory.check = (val) => val.__type === type;

  factory[GRAPHQL] = () => (new GraphQLObjectType({
    name: type,
    fields: () => (
      fields.reduce((graphQLFields, field) => {
        graphQLFields[field.name] = {type: toGraphQL(field.type)};
        return graphQLFields;
      }, {})
    ),
    isTypeOf(obj) { return factory.check(obj); },
  }));

  return factory;
}
