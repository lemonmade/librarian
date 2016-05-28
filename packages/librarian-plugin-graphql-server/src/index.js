import {GraphQLObjectType, GraphQLSchema} from 'graphql';
import graphqlHTTP from 'express-graphql';
import express from 'express';
import open from 'open';
import toGraphQL from 'librarian/src/types/graphql';

export default function graphQLServer() {
  function startGraphQLServer({library, logger}) {
    logger('Starting GraphQL Server at http://localhost:3000', {plugin: 'graphql-server'});
    logger('Press ^C to kill the server', {plugin: 'graphql-server'});

    const schema = createSchema({data: library, descriptor: library.descriptor});
    const app = express();

    app
      .use('/graphql', graphqlHTTP({schema, graphiql: true}))
      .listen(3000, () => open('http://localhost:3000/graphql?query=%7B%0A%20%20library%20%7B%0A%20%20%20%20%0A%20%20%7D%0A%7D'));
  }

  return function setup({renderer}) {
    renderer.add(startGraphQLServer);
  };
}

function createSchema({data, descriptor}) {
  const LibraryType = toGraphQL(descriptor);

  return new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: {
        library: {
          type: LibraryType,
          resolve() { return data; },
        },
      },
    }),
  });
}
