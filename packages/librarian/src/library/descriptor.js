import {GraphQLObjectType} from 'graphql';
import {arrayOf, nodeType} from '../types';
import toGraphQL, {GRAPHQL} from '../types/graphql';

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
      resolve: (library) => library.get(type),
      type: toGraphQL(arrayOf(nodeType(type))),
    };
  }

  return fields;
}

class LibraryDescriptorNamespace {
  namespaces = {};
  description = {};

  namespace(name, creator) {
    const newNamespace = new LibraryDescriptorNamespace();
    this.namespaces[name] = newNamespace;
    creator(newNamespace);
  }

  entities(entity) {
    this.description[entity.name] = entity;
  }

  [GRAPHQL]() {
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

  [GRAPHQL]() {
    return this.rootNamespace[GRAPHQL]();
  }
}
