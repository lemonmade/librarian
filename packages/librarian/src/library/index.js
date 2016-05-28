import LibraryDescriptor from './descriptor';
import EntityProxy from './proxy';
import {GRAPHQL} from '../types/graphql';

export default class Library {
  descriptor = new LibraryDescriptor();
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

  remove(entity) {
    this.entities.delete(entity);
  }

  getID(id) {
    return this.filter((entity) => entity.id === id)[0];
  }

  filter(predicate) {
    const matches = [];
    for (const entity of this.entities) {
      if (predicate(entity)) { matches.push(entity); }
    }
    return matches;
  }

  get(EntityType, predicate = () => true) {
    return this
      .filter((entity) => EntityType.check(entity) && predicate(entity))
      .map((entity) => EntityType(entity));
  }

  describe(describer) {
    describer(this.descriptor);
  }

  proxy(...args) {
    const newProxy = new EntityProxy(...args);
    this.proxies.push(newProxy);
    return newProxy;
  }

  resolve(entity) {
    return entity instanceof EntityProxy ? entity.resolve(this) : entity;
  }

  toJSON(...args) {
    return JSON.stringify(this.entities, ...args);
  }

  [GRAPHQL]() {
    return this.descriptor[GRAPHQL]();
  }
}
