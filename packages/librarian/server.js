import {GraphQLObjectType, GraphQLSchema} from 'graphql';
import graphqlHTTP from 'express-graphql';
import express from 'express';

import data from '../../output/librarian/dump.json';

import toGraphQL from './types/graphql';
import loadConfig from './config';
import register from './register';

(async () => {
  const config = await loadConfig();
  const {library} = register(config);
  const schema = createSchemaWithLibrary(library);
  const app = express();

  app
    .use('/graphql', graphqlHTTP({schema, graphiql: true}))
    .listen(3000, () => {
      console.log('listening on http://localhost:3000');
    });
})().catch((e) => console.log(e.stack));

function createSchemaWithLibrary(library) {
  const LibraryType = new GraphQLObjectType({
    name: 'Library',
    fields: Object.keys(library).reduce((fields, field) => {
      fields[field] = {
        type: toGraphQL(library[field].type),
        resolve: library[field].resolve,
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
