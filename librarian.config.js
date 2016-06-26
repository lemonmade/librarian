var path = require('path');
var sass = require('./packages/librarian-plugin-sass').default;
var javascript = require('./packages/librarian-plugin-javascript').default;
var react = require('./packages/librarian-plugin-react').default;
var shopify = require('./packages/librarian-plugin-shopify').default;
var generateAutocompleteData = require('./generate-autocomplete-data').default;
var graphQLServer = require('./packages/librarian-plugin-graphql-server').default;
var staticSiteGenerator = require('./packages/librarian-static-site-generator').default;

module.exports = {
  // source: ['example/**/*.js', 'example/**/*.rb', 'example/**/*.scss'],
  source: ['example/**/*.js'],
  output: 'output/librarian',
  plugins: [
    // javascript(),
    react(),
    // shopify(),
    // sass({nested: true}),
    staticSiteGenerator({template: 'template.ejs'}),
    // generateAutocompleteData({
    //   destination: path.join(__dirname, '../quilt-completions/data.json'),
    // }),
    graphQLServer(),
  ],
};
