import {GraphQLObjectType} from 'graphql';
import toGraphQL, {GRAPHQL} from './graphql';
import {optional} from './base';

class FieldWrapper {
  constructor(properties, computed) {
    this.properties = properties;
    this.computed = computed;
  }

  resolve() {
    if (typeof this.properties === 'function') {
      this.properties = this.properties();
    }

    if (typeof this.computed === 'function') {
      this.computed = this.computed();
    }
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

      if (!field.type(obj[name])) {
        throw new Error(`Unexpected field value for '${name}'`);
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

  get fields() {
    this.resolve();
    const {properties, computed} = this;
    const fields = [
      ...Object.keys(properties).map((field) => {
        const property = properties[field];
        return {
          name: field,
          type: property.optional ? optional(property.type) : property.type,
          computed: false,
        };
      }),

      ...Object.keys(computed).map((field) => {
        const property = computed[field];
        return {
          name: field,
          type: property.optional ? optional(property.type) : property.type,
          get: property.get,
          computed: true,
        };
      }),
    ];

    Object.defineProperty(this, 'fields', {value: fields});
    return fields;
  }

  get defaults() {
    this.resolve();
    const {properties} = this;

    const defaults = Object
      .keys(properties)
      .reduce((allDefaults, field) => {
        if (properties[field].hasOwnProperty('default')) {
          allDefaults[field] = properties[field].default;
        }

        return allDefaults;
      }, {});

    Object.defineProperty(this, 'defaults', {value: defaults});
    return defaults;
  }
}

export default function defineType(type, {
  properties = {},
  computed = {},
} = {}) {
  let base;
  const fields = new FieldWrapper(properties, computed);

  function factory(details = {}) {
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
      .reduce((obj, key) => {
        obj[key] = finalDetails[key];
        return obj;
      }, Object.create(base));
  }

  factory.type = type;

  factory.check = (val) => typeof val.is === 'function' && val.is(factory);

  factory[GRAPHQL] = () => (new GraphQLObjectType({
    name: type,
    fields: fields
      .reduce((graphQLFields, field) => {
        graphQLFields[field.name] = {type: toGraphQL(field.type)};
        return graphQLFields;
      }, {}),
    isTypeOf(obj) { return factory.matches(obj); },
  }));
  return factory;
}
