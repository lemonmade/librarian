import LibraryDescriptor from './descriptor';
import {GRAPHQL} from '../types/graphql';

export default class Library {
  descriptor = new LibraryDescriptor();

  constructor(entities = []) {
    this.entities = entities;
  }

  add(entities) {
    this.entities.push(...entities);
  }

  filter(predicate) {
    return this.entities.filter(predicate);
  }

  get(EntityType, predicate = () => true) {
    return this
      .filter((entity) => EntityType.check(entity) && predicate(entity))
      .map((entity) => EntityType(entity));
  }

  describe(describer) {
    describer(this.descriptor);
  }

  toJSON(...args) {
    return JSON.stringify(this.entities, ...args);
  }

  [GRAPHQL]() {
    return this.descriptor[GRAPHQL]();
  }
}
