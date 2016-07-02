class Tag {
  constructor({name, process: processTag, aliases = [], multiple = false}) {
    this.name = name;
    this.aliases = aliases;
    this.process = processTag;
    this.multiple = multiple;
  }

  get names() {
    return [this.name, ...this.aliases];
  }
}

class TagContainer {
  constructor(tags = []) {
    this.tags = tags;
  }

  tag(name) {
    return this.tags.find((tag) => tag.names.includes(name));
  }

  get tagMatcher() {
    return `(?:${this.names.join('|')})`;
  }

  get names() {
    return this.tags.reduce((names, tag) => [...names, ...tag.names], []);
  }
}

export function createTag(...args) {
  return new Tag(...args);
}

export function createTagContainer(...args) {
  return new TagContainer(...args);
}
