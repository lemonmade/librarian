import {optional} from '../types';

export default class FieldWrapper {
  constructor(fields) {
    this.uncheckedFields = fields;
  }

  validate(obj) {
    Object.values(this.fields).forEach((field) => {
      const {name} = field;

      if (field.computed) {
        if (obj.hasOwnProperty(name)) {
          throw new Error(`Unexpected assignment of computed property '${name}'`);
        }

        return;
      }

      if (!field.type.check(obj[name])) {
        throw new Error(`Unexpected field value for '${name}' (${obj[name]})`);
      }
    });
  }

  field(fieldName) {
    return this.fields[fieldName];
  }

  includes(fieldName) {
    return this.fields.hasOwnProperty(fieldName);
  }

  get baseObject() {
    const base = Object
      .values(this.fields)
      .filter((field) => field.computed)
      .reduce((baseObject, field) => {
        Object.defineProperty(baseObject, field.name, {
          get() { return field.get(this); },
        });

        return baseObject;
      }, {});

    return base;
  }

  get fields() {
    const fields = typeof this.uncheckedFields === 'function'
      ? this.uncheckedFields()
      : this.uncheckedFields;

    Object.entries(fields).forEach(([name, field]) => {
      field.name = name;
      field.computed = (typeof field.get === 'function');
      field.type = field.optional ? optional(field.type) : field.type;
    });

    Object.defineProperty(this, 'fields', {value: fields});
    return fields;
  }

  get defaults() {
    const defaults = Object
      .values(this.fields)
      .filter((field) => field.hasOwnProperty('default'))
      .reduce((allDefaults, field) => ({...allDefaults, [field.name]: field.default}), {});

    Object.defineProperty(this, 'defaults', {value: defaults});
    return defaults;
  }
}
