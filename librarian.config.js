var path = require('path');
var javascript = require('./packages/librarian-plugin-javascript').default;
var shopify = require('./packages/librarian-plugin-shopify').default;
var generateAutocompleteData = require('./generate-autocomplete-data').default;

module.exports = {
  source: ['example/**/*.js', 'example/**/*.rb'],
  output: 'output/librarian',
  plugins: [
    javascript({nested: true}),
    shopify({nested: true}),
    generateAutocompleteData({
      destination: path.join(__dirname, '../quilt-completions/data.json'),
    }),
  ],
};
