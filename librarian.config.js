var path = require('path');
var javascript = require('./packages/librarian-plugin-javascript').default;
var shopify = require('./packages/librarian-plugin-shopify').default;
var generateAutocompleteData = require('./generate-autocomplete-data').default;
var graphQLServer = require('./packages/librarian-plugin-graphql-server').default;

module.exports = {
  source: ['example/**/*.js', 'example/**/*.rb'],
  output: 'output/librarian',
  plugins: [
    javascript(),
    shopify(),
    generateAutocompleteData({
      destination: path.join(__dirname, '../quilt-completions/data.json'),
    }),
    graphQLServer(),
  ],
};
