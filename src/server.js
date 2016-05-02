import {GraphQLObjectType, GraphQLSchema} from 'graphql';
import graphqlHTTP from 'express-graphql';
import express from 'express';

import javascript from './plugins/javascript';
import toGraphQL from './types/graphql';

import viewer from './data';
import register from './register';

const viewerConfig = register({plugins: [javascript]});

const ViewerType = new GraphQLObjectType({
  name: 'Viewer',
  fields: Object.keys(viewerConfig).reduce((fields, field) => {
    fields[field] = {type: toGraphQL(viewerConfig[field].type)};
    return fields;
  }, {}),
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      viewer: {
        type: ViewerType,
        resolve() { return viewer; },
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
