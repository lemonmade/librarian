import {GraphQLObjectType, GraphQLSchema} from 'graphql';
import graphqlHTTP from 'express-graphql';
import express from 'express';
import open from 'open';

import graphQLCreator from 'librarian/src/graphql';
import plugin from 'librarian/src/plugin';

export default plugin('GraphQL', ({openOnStart = false}) => ({
  render(library, {library: descriptor, logger}) {
    logger('Starting GraphQL Server at http://localhost:3000', {plugin: 'graphql-server'});
    logger('Press ^C to kill the server', {plugin: 'graphql-server'});

    const schema = createSchema({data: library, descriptor});
    const app = express();

    app
      .use('/graphql', graphqlHTTP({schema, graphiql: true}))
      .listen(3000, () => {
        if (!openOnStart) { return; }
        open('http://localhost:3000/graphql?query=%7B%0A%20%20library%20%7B%0A%20%20%20%20%0A%20%20%7D%0A%7D');
      });
  },
}));

function createSchema({data, descriptor}) {
  const LibraryType = graphQLCreator()(descriptor);

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
