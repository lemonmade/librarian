let addCount = 1;

class Builder {
  entities = new Map();
  adds = [];
  afterAdds = {};

  constructor({builders, indexBy = (val) => val}) {
    this.builders = builders.filter((builder) => typeof builder.handles === 'function');
    this.indexBy = indexBy;
  }

  get(val, ...args) {
    const {entities, builders, indexBy} = this;
    const indexer = indexBy(val);

    if (entities.has(indexer)) {
      return entities.get(indexer);
    }

    addCount += 1;
    this.currentAdd = addCount;
    this.adds.push(addCount);

    const matchingBuilder = builders.find((builder) => builder.handles(val, ...args));
    if (matchingBuilder) {
      const result = matchingBuilder(val, ...args);
      if (result) { entities.set(indexer, result); }
    }

    const action = this.afterAdds[this.currentAdd];
    if (action) { action(); }

    this.adds.pop();
    delete this.afterAdds[this.currentAdd];
    this.currentAdd = this.adds[this.adds.length - 1];

    return entities.get(indexer);
  }

  afterAdd(callback) {
    this.afterAdds[this.currentAdd] = callback;
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
