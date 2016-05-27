const types = new WeakMap();
export const GRAPHQL = Symbol('toGraphQL');

export default function toGraphQL(type, ...args) {
  if (type[GRAPHQL] == null) {
    throw new Error('Object does not have a GraphQL method.');
  }

  let graphQLType = types.get(type);

  if (graphQLType == null) {
    graphQLType = type[GRAPHQL](...args);
    types.set(type, graphQLType);
  }

  return graphQLType;
}
