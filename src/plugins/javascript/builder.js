export default class Builder {
  entities = new Map();
  sourcePaths = new Map();
  modules = {};

  constructor({tags, parse, traverse, config, builders}) {
    this.tags = tags;
    this.parse = parse;
    this.config = config;
    this.traverse = traverse;
    this.builders = builders.filter((builder) => typeof builder.handles === 'function');
  }

  set(path, entity, {isSourcePath = false} = {}) {
    const {node} = path;
    this.entities.set(node, entity);

    if (isSourcePath) {
      this.sourcePaths.set(entity, path);
    }

    return entity;
  }

  getPath(path, state) {
    const entity = this.get(path, state);
    return this.sourcePaths.get(entity);
  }

  getModule(file) {
    const {modules, tags, parse, traverse, config} = this;
    const filename = config.rootRelative(file);
    if (modules.hasOwnProperty(filename)) {
      return modules[filename];
    }

    let modulePath;

    traverse(parse(config.getSource(file)), {
      Program: (path) => { modulePath = path; },
    });

    const result = this.get(modulePath, {filename, builder: this, tags, config});
    modules[filename] = result;
    return result;
  }

  get(path, ...args) {
    const {entities, builders} = this;
    const {node} = path;

    if (node == null) { return node; }

    if (entities.has(node)) {
      return entities.get(node);
    }

    const matchingBuilder = builders.find((builder) => builder.handles(path, ...args));
    return matchingBuilder ? matchingBuilder(path, ...args) : null;
  }
}
