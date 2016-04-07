import traverse from 'babel-traverse';
import parse from 'plugins/javascript/parse';
import symbolize from 'plugins/javascript/symbolize';

export function firstSymbol(source) {
  let symbol;

  traverse(parse(source), {
    Program(path) {
      symbol = symbolize(path.get('body')[0]);
    },
  });

  return symbol;
}
