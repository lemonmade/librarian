import traverse from 'babel-traverse';
import parse from 'plugins/javascript/parse';

export function symbolize(source, symbolizer) {
  let symbol;

  traverse(parse(source), {
    Program(path) {
      symbol = symbolizer(path.get('body.0'));
    },
  });

  return symbol;
}
