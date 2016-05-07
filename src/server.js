import {GraphQLObjectType, GraphQLSchema} from 'graphql';
import graphqlHTTP from 'express-graphql';
import express from 'express';

import javascript from './plugins/javascript';
import toGraphQL from './types/graphql';

import data from './data';
import register from './register';

const {viewer} = register({plugins: [javascript]});

const ViewerType = new GraphQLObjectType({
  name: 'Viewer',
  fields: Object.keys(viewer).reduce((fields, field) => {
    fields[field] = {type: toGraphQL(viewer[field].type)};
    return fields;
  }, {}),
});

const schema = new GraphQLSchema({
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

const app = express();

app
  .use('/graphql', graphqlHTTP({schema, graphiql: true}))
  .listen(3000, () => {
    console.log('listening on http://localhost:3000');
  });
