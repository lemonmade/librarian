import * as Builders from './builders';

class Builder {
  entities = new Map();

  constructor(builders) {
    this.builders = builders;
  }

  get(path, ...args) {
    const {node} = path;
    const {entities, builders} = this;

    if (!entities.has(node)) {
      const matchingBuilder = builders.find((builder) => builder.handles(path, ...args));
      if (matchingBuilder) {
        const result = matchingBuilder(path, ...args);
        if (result) { entities.set(node, result); }
      }
    }

    return entities.get(node);
  }

  [Symbol.iterator]() {
    return this.entities.values();
  }

  all() {
    return new Set(this);
  }
}

export default function createBuilder() {
  const builders = Object.values(Builders).filter((builder) => typeof builder.handles === 'function');
  return new Builder(builders);
}
