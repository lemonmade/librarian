export default class Library {
  constructor(entities = []) {
    this.entities = entities;
  }

  filter(predicate) {
    return this.entities.filter(predicate);
  }

  get(EntityType, predicate = () => true) {
    return this
      .filter((entity) => EntityType.check(entity) && predicate(entity))
      .map((entity) => EntityType(entity));
  }

  toJSON(...args) {
    return JSON.stringify(this.entities, ...args);
  }
}
