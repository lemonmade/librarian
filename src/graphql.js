export const TO_GRAPHQL = Symbol('toGraphQL');
export const TO_GRAPHQL_ARGS = Symbol('toGraphQLArgs');

export default function createGraphQLConverter() {
  const cache = new WeakMap();
  const argsCache = new WeakMap();

  function toGraphQL(type) {
    if (type[TO_GRAPHQL] == null) {
      throw new Error('Object does not have a GraphQL method.');
    }

    let graphQLType = cache.get(type);

    if (graphQLType == null) {
      graphQLType = type[TO_GRAPHQL](toGraphQL);
      cache.set(type, graphQLType);
    }

    return graphQLType;
  }

  toGraphQL.args = (type) => {
    if (typeof type[TO_GRAPHQL_ARGS] !== 'function') {
      throw new Error('Object does not have a GraphQLArgs method.');
    }

    let graphQLArgs = argsCache.get(type);

    if (graphQLArgs == null) {
      graphQLArgs = type[TO_GRAPHQL_ARGS](toGraphQL);
      argsCache.set(type, graphQLArgs);
    }

    return graphQLArgs;
  };

  return toGraphQL;
}

const GRAPHQL_UNACCEPTABLE_CHARACTERS = /[^_a-zA-Z0-9]/g;

export function graphQLName(name) {
  return name.replace(GRAPHQL_UNACCEPTABLE_CHARACTERS, '');
}
