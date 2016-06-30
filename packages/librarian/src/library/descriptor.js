import {GraphQLObjectType} from 'graphql';
import {arrayOfType} from '../types';
import {TO_GRAPHQL, TO_GRAPHQL_ARGS} from '../graphql';
import {isMatch} from 'lodash';

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

  [TO_GRAPHQL](toGraphQL) {
    return new GraphQLObjectType({
      name: 'Library',
      fields: toGraphQLFields(this, toGraphQL),
    });
  }
}

export default class LibraryDescriptor {
  root = Symbol();
  resolvers = {};
  rootNamespace = new LibraryDescriptorNamespace();

  namespace(namespace, creator) {
    if (namespace === this.root) {
      creator(this.rootNamespace);
    } else {
      this.rootNamespace.namespace(namespace, creator);
    }
  }

  resolveID({for: name, resolve}) {
    this.resolvers[name] = resolve;
  }

  get idResolver() {
    const {resolvers} = this;

    return function resolveID(id, {library, source}) {
      if (resolvers[source]) {
        return resolvers[source](id, library);
      }

      return library.find((entity) => entity.id.equals(id));
    };
  }

  [Symbol.iterator]() {
    return this.rootNamespace[Symbol.iterator]();
  }

  [TO_GRAPHQL](...args) {
    return this.rootNamespace[TO_GRAPHQL](...args);
  }
}

function toGraphQLFields(namespace, toGraphQL) {
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
      args: toGraphQL.args(type),
      resolve: (library, args) => (
        library.findAll((entity) => type.check(entity) && isMatch(entity, args))
      ),
      type: toGraphQL(arrayOfType(type)),
    };
  }

  return fields;
}
