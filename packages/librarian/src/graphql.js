const types = new WeakMap();
export const TO_GRAPHQL = Symbol('toGraphQL');

export default function toGraphQL(type, ...args) {
  if (type[TO_GRAPHQL] == null) {
    throw new Error('Object does not have a GraphQL method.');
  }

  if (args.length) {
    return type[TO_GRAPHQL](...args);
  }

  let graphQLType = types.get(type);

  if (graphQLType == null) {
    graphQLType = type[TO_GRAPHQL](...args);
    types.set(type, graphQLType);
  }

  return graphQLType;
}

export function toGraphQLArgs(type, ...args) {
  return toGraphQL(type, {argsOnly: true}, ...args);
}

const GRAPHQL_UNACCEPTABLE_CHARACTERS = /[^_a-zA-Z0-9]/g;

export function graphQLName(name) {
  return name.replace(GRAPHQL_UNACCEPTABLE_CHARACTERS, '');
}
