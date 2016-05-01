class Container {
  types = {};

  constructor({name, types = []}) {
    this.name = name;
    types.forEach((type) => this.register(type));
  }

  register(factory) {
    this.types[factory.type] = factory;
    factory.owner = this;
  }

  get(type) {
    if (!this.types.hasOwnProperty(type)) {
      throw new Error(`Type '${type}' not found. Make sure you registered it this type container first!`);
    }

    return this.types[type];
  }
}

export default function createTypeContainer(language, options = {}) {
  return new Container({...options, name: language});
}
