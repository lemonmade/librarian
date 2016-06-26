/* @noflow */

module.exports = {
  extends: [
    'plugin:shopify/mocha',
  ],
  globals: {
    sinon: false,
    expect: false,
  },
  rules: {
    'no-unused-expressions': 'off',
    'newline-per-chained-call': 'off',
  },
};
