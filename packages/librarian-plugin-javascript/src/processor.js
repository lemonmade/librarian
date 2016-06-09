import traverse from 'babel-traverse';
import parse from './parse';

import tags from './tags';
import createBuilder from './builder';

export default function processor({filename, source}, {config}) {
  config.logger(`Processing ${filename}`, {
    plugin: 'javascript',
  });

  const builder = createBuilder();

  function processDeclaration(...args) { builder.get(...args); }

  traverse(parse(source), {
    ExportDefaultDeclaration: processDeclaration,
  }, null, {filename, builder, tags, config});

  return builder.all();
}
