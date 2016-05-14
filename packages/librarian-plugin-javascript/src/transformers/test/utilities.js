import traverse from 'babel-traverse';
import parse from '../../parse';
import tags from '../../tags';

export function symbolize(source, symbolizer, {nth = 0} = {}) {
  let symbol;

  traverse(parse(source), {
    Program(path, ...args) {
      symbol = symbolizer(path.get(`body.${nth}`), ...args);
    },
  }, null, {filename: 'test.js', tags});

  return symbol;
}
