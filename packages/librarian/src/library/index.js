export {default as Descriptor} from './descriptor';

export default class Library {
  proxies = [];

  constructor(entities = []) {
    this.entities = new Set(entities);
  }

  add(newEntities) {
    const {entities} = this;
    for (const entity of newEntities) {
      entities.add(entity);
    }
  }

  get({id, type}, predicate = () => true) {
    if (id) {
      return this.filter((entity) => entity.id === id)[0];
    } else if (type) {
      return this.filter((entity) => type.check(entity) && predicate(entity));
    } else {
      return null;
    }
  }

  filter(predicate) {
    const matches = [];
    for (const entity of this.entities) {
      if (predicate(entity)) { matches.push(entity); }
    }
    return matches;
  }

  toJSON(...args) {
    return JSON.stringify(this.entities, ...args);
  }
}
