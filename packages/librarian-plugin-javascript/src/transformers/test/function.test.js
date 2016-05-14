import {symbolize} from './utilities';
import functionFromPath from '../function';

describe('function', () => {
  describe('.name', () => {
    it('extracts the function name', () => {
      expect(symbolize('function foo() {}', functionFromPath))
        .to.have.property('name')
        .that.equals('foo');
    });
  });

  describe('.params', () => {
    it('has an empty array when no params', () => {
      expect(symbolize('function foo() {}', functionFromPath))
        .to.have.property('params')
        .that.containSubset([]);
    });

    it('handles simple params', () => {
      expect(symbolize('function foo(bar, baz) {}', functionFromPath))
        .to.have.property('params')
        .that.containSubset([
          {name: 'bar'},
          {name: 'baz'},
        ]);
    });

    it.skip('handles simple default values', () => {
      const symbolized = symbolize('function foo(bar = 12, baz = "12") {}', functionFromPath);

      expect(symbolized)
        .to.have.deep.property('params[0]')
        .that.containSubset({name: 'bar', default: 12});

      expect(symbolized)
        .to.have.deep.property('params[0]')
        .that.containSubset({name: 'baz', default: '12'});
    });

    it('handles object destructuring params', () => {
      expect(symbolize('function foo({bar, baz}) {}', functionFromPath))
        .to.have.deep.property('params[0]')
        .that.containSubset({
          properties: [
            {name: 'bar'},
            {name: 'baz'},
          ],
        });
    });

    it.skip('handles object destructuring params with default values', () => {
      expect(symbolize('function foo({bar = "12", baz = 12}) {}', functionFromPath))
        .to.have.deep.property('params[0]')
        .that.containSubset({
          properties: [
            {name: 'bar', default: '12'},
            {name: 'baz', default: 12},
          ],
        });
    });
  });
});
