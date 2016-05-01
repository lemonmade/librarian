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
        .that.deep.equals([]);
    });

    it('handles simple params', () => {
      expect(symbolize('function foo(bar, baz) {}', functionFromPath))
        .to.have.property('params')
        .that.deep.equals([
          {name: 'bar'},
          {name: 'baz'},
        ]);
    });

    it('handles simple default values', () => {
      expect(symbolize('function foo(bar = 12, baz = "12") {}', functionFromPath))
        .to.have.property('params')
        .that.deep.equals([
          {name: 'bar', default: 12},
          {name: 'baz', default: '12'},
        ]);
    });

    it('handles object destructuring params', () => {
      expect(symbolize('function foo({bar, baz}) {}', functionFromPath))
        .to.have.property('params')
        .that.deep.equals([{
          properties: [
            {name: 'bar'},
            {name: 'baz'},
          ],
        }]);
    });

    it('handles object destructuring params', () => {
      expect(symbolize('function foo({bar = "12", baz = 12}) {}', functionFromPath))
        .to.have.property('params')
        .that.deep.equals([{
          properties: [
            {name: 'bar', default: '12'},
            {name: 'baz', default: 12},
          ],
        }]);
    });
  });
});
