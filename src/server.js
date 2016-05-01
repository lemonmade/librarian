import {GraphQLObjectType, GraphQLList, GraphQLSchema} from 'graphql';
import graphqlHTTP from 'express-graphql';
import express from 'express';

import jsTypes from './plugins/javascript/types';
import toGraphQL from './types/graphql';

import viewer from './data';

const classType = jsTypes.get('Class');

const ViewerType = new GraphQLObjectType({
  name: 'Viewer',
  fields: {
    classes: {type: new GraphQLList(toGraphQL(classType))},
  },
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
