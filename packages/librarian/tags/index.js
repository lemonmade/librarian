class Tag {
  constructor({name, process: processTag, aliases = []}) {
    this.name = name;
    this.aliases = aliases;
    this.process = processTag;
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

export function createTag(options) {
  return new Tag(options);
}

export function createTagContainer(tags) {
  return new TagContainer(tags);
}
