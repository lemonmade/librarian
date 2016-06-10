class Builder {
  entities = new Map();

  constructor({builders, indexBy = (val) => val}) {
    this.builders = builders;
    this.indexBy = indexBy;
  }

  get(val, ...args) {
    const {entities, builders, indexBy} = this;
    const indexer = indexBy(val);

    if (!entities.has(indexer)) {
      const matchingBuilder = builders.find((builder) => builder.handles(val, ...args));
      if (matchingBuilder) {
        const result = matchingBuilder(val, ...args);
        if (result) { entities.set(indexer, result); }
      }
    }

    return entities.get(indexer);
  }

  [Symbol.iterator]() {
    return this.entities.values();
  }

  all() {
    return new Set(this);
  }
}

export default function createBuilder(...args) {
  return new Builder(...args);
}
