import {GraphQLObjectType} from 'graphql';
import {arrayOfType} from '../types';
import toGraphQL, {TO_GRAPHQL} from '../graphql';

class LibraryDescriptorNamespace {
  namespaces = {};
  description = {};

  constructor(name) {
    this.name = name;
  }

  namespace(name, creator) {
    const newNamespace = new LibraryDescriptorNamespace(name);
    this.namespaces[name] = newNamespace;
    creator(newNamespace);
  }

  entities(entity) {
    this.description[entity.name] = entity;
  }

  eachEntity() {
    return Object.values(this.description)[Symbol.iterator]();
  }

  eachNamespace() {
    return Object.values(this.namespaces)[Symbol.iterator]();
  }

  [Symbol.iterator]() {
    return this.eachNamespace();
  }

  [TO_GRAPHQL]() {
    return new GraphQLObjectType({
      name: 'Library',
      fields: toGraphQLFields(this),
    });
  }
}

export default class LibraryDescriptor {
  root = Symbol();
  rootNamespace = new LibraryDescriptorNamespace();

  namespace(namespace, creator) {
    if (namespace === this.root) {
      creator(this.rootNamespace);
    } else {
      this.rootNamespace.namespace(namespace, creator);
    }
  }

  [Symbol.iterator]() {
    return this.rootNamespace[Symbol.iterator]();
  }

  [TO_GRAPHQL]() {
    return this.rootNamespace[TO_GRAPHQL]();
  }
}

function toGraphQLFields(namespace) {
  const fields = {};

  for (const [name, subNamespace] of Object.entries(namespace.namespaces)) {
    const NamespaceType = new GraphQLObjectType({
      name: `LibraryNamespace${name[0].toUpperCase()}${name.substring(1)}`,
      fields: toGraphQLFields(subNamespace),
    });

    fields[name] = {
      name,
      type: NamespaceType,
      resolve(library) { return library; },
    };
  }

  for (const {name, type} of Object.values(namespace.description)) {
    fields[name] = {
      name,
      resolve: (library) => library.findAll((entity) => type.check(entity)),
      type: toGraphQL(arrayOfType(type)),
    };
  }

  return fields;
}
