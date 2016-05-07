var javascript = require('./packages/librarian-plugin-javascript').default;

module.exports = {
  source: ['example/**/*.js'],
  output: 'output/librarian',
  plugins: [
    javascript(),
  ],
};
