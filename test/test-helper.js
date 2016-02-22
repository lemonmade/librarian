import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import parse from 'parse';
import symbolize from 'symbolize';
import traverse from 'babel-traverse';

chai.use(sinonChai);

export {
  expect,
  sinon,
};

export function firstSymbol(source: string) {
  let symbol;

  traverse(parse(source), {
    Program(path) {
      symbol = symbolize(path.get('body')[0]);
    },
  });

  return symbol;
}
