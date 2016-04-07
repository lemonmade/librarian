/* @noflow */

module.exports = {
  env: {
    es6: true,
    node: true,
    mocha: true,
  },
  globals: {
    sinon: false,
    expect: false,
  },
  rules: {
    'no-unused-expressions': 0,
    'newline-per-chained-call': 0,
  },
};
