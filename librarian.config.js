var path = require('path');
var javascript = require('./packages/librarian-plugin-javascript').default;
var shopify = require('./packages/librarian-plugin-shopify').default;
var generateAutocompleteData = require('./generate-autocomplete-data').default;
var graphQLServer = require('./packages/librarian-plugin-graphql-server').default;
var staticSiteGenerator = require('./packages/librarian-static-site-generator').default;

module.exports = {
  // source: ['example/**/*.js', 'example/**/*.rb'],
  source: ['example/**/*.js'],
  output: 'output/librarian',
  plugins: [
    javascript(),
    shopify(),
    staticSiteGenerator({template: 'template.ejs'}),
    // generateAutocompleteData({
    //   destination: path.join(__dirname, '../quilt-completions/data.json'),
    // }),
    graphQLServer(),
  ],
};
