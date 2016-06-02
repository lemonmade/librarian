import traverse from 'babel-traverse';

import Builder from '../';
import parse from '../../parse';
import tags from '../../tags';

export function firstEntity(source) {
  const builder = new Builder();
  const symbols = [];

  traverse(parse(source), {
    Program(path, ...args) {
      path
        .get('body')
        .forEach((bodyPath) => {
          symbols.push(builder.get(bodyPath, ...args));
        });
    },
  }, null, {filename: 'test.js', tags, builder});

  return symbols[0];
}
