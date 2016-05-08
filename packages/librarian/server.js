import {GraphQLObjectType, GraphQLSchema} from 'graphql';
import graphqlHTTP from 'express-graphql';
import express from 'express';

import data from '../../output/librarian/dump.json';

import toGraphQL from './types/graphql';
import loadConfig from './config';
import register from './register';

(async () => {
  const config = await loadConfig();
  const {viewer} = register(config);
  const schema = createSchemaWithViewer(viewer);
  const app = express();

  app
    .use('/graphql', graphqlHTTP({schema, graphiql: true}))
    .listen(3000, () => {
      console.log('listening on http://localhost:3000');
    });
})().catch((e) => console.log(e.stack));

function createSchemaWithViewer(viewer) {
  const ViewerType = new GraphQLObjectType({
    name: 'Viewer',
    fields: Object.keys(viewer).reduce((fields, field) => {
      fields[field] = {
        type: toGraphQL(viewer[field].type),
        resolve: viewer[field].resolve,
      };
      return fields;
    }, {}),
  });

  return new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: {
        viewer: {
          type: ViewerType,
          resolve() { return data; },
        },
      },
    }),
  });
}
