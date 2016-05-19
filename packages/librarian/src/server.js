import {GraphQLObjectType, GraphQLSchema} from 'graphql';
import graphqlHTTP from 'express-graphql';
import express from 'express';

import toGraphQL from './types/graphql';
import loadConfig from './config';
import register from './register';
import {load} from '.';

(async () => {
  const library = await load();
  const config = await loadConfig();
  const {library: descriptor} = register(config);
  const schema = createSchema({data: library, descriptor});
  const app = express();

  app
    .use('/graphql', graphqlHTTP({schema, graphiql: true}))
    .listen(3000, () => {
      console.log('listening on http://localhost:3000');
    });
})().catch((e) => console.log(e.stack));

function createSchema({data, descriptor}) {
  const LibraryType = new GraphQLObjectType({
    name: 'Library',
    fields: Object.keys(descriptor).reduce((fields, field) => {
      fields[field] = {
        type: toGraphQL(descriptor[field].type),
        resolve: descriptor[field].resolve,
      };
      return fields;
    }, {}),
  });

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
