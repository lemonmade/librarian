import classBuilder from './class';
import methodBuilder from './method';
import propertyBuilder from './property';
import functionBuilder from './function';
import typeBuilder from './type';
import valueBuilder from './value';

const BUILDERS = [
  classBuilder,
  methodBuilder,
  propertyBuilder,
  functionBuilder,
  typeBuilder,
  valueBuilder,
].filter((builder) => typeof builder.handles === 'function');

export default class Builder {
  entities = new Map();

  get(path, state) {
    const {node} = path;
    const {entities} = this;

    if (!entities.has(node)) {
      const matchingBuilder = BUILDERS.find((builder) => builder.handles(path));
      if (matchingBuilder) { entities.set(node, matchingBuilder(path, state)); }
    }

    return entities.get(node);
  }

  [Symbol.iterator]() {
    return this.entities.values();
  }
}