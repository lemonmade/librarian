import traverse from 'babel-traverse';
import createBuilder from 'librarian/src/builder';

import * as Builders from './builders';
import parse from './parse';
import tags from './tags';

const builders = Object.values(Builders);

export default function processor({filename, source}, {config}) {
  config.logger(`Processing ${filename}`, {
    plugin: 'javascript',
  });

  const builder = createBuilder({builders, indexBy: (path) => path.node});

  function processDeclaration(...args) { builder.get(...args); }

  traverse(parse(source), {
    Program: processDeclaration,
  }, null, {filename, builder, tags, config});

  return builder.all();
}
