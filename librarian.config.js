var javascript = require('librarian/plugins/javascript');
var renderer = require('librarian/renderers/react');

module.exports = {
  // These can export all other things
  plugins: [
    javascript({options: true}),
  ],

  renderer: renderer({options: true}),
};
