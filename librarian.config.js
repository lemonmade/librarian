var javascript = require('./packages/librarian-plugin-javascript').default;
var shopify = require('./packages/librarian-plugin-shopify').default;

module.exports = {
  source: ['example/**/*.js', 'example/**/*.rb'],
  output: 'output/librarian',
  plugins: [
    javascript(),
    shopify(),
  ],
};
