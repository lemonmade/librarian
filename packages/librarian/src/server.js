import {GraphQLObjectType, GraphQLSchema} from 'graphql';
import graphqlHTTP from 'express-graphql';
import express from 'express';

import toGraphQL from './types/graphql';
import loadConfig from './config';
import {load} from '.';

(async () => {
  const library = await load();
  const config = await loadConfig();
  const schema = createSchema({data: library, descriptor: config.library.descriptor});
  const app = express();

  app
    .use('/graphql', graphqlHTTP({schema, graphiql: true}))
    .listen(3000, () => {
      console.log('listening on http://localhost:3000');
    });
})().catch((e) => console.log(e.stack));

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
