import traverse from 'babel-traverse';
import parse from '../../parse';

export function symbolize(source, symbolizer, {nth = 0} = {}) {
  let symbol;

  traverse(parse(source), {
    Program(path) {
      symbol = symbolizer(path.get(`body.${nth}`));
    },
  });

  return symbol;
}
