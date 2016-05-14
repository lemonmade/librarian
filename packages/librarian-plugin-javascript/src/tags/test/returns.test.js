import {TypeType} from '../../entities';
import returnsTag from '../returns';

describe('returnsTag', () => {
  it('has the correct name', () => {
    expect(returnsTag)
      .to.have.property('name')
      .that.equals('returns');
  });

  it('has the correct aliases', () => {
    expect(returnsTag)
      .to.have.property('names')
      .that.deep.equals(['returns', 'return']);
  });

  describe('.process()', () => {
    it('generates a type from the string', () => {
      expect(returnsTag.process('string')).to.deep.equal(TypeType({type: 'string'}));
    });
  });
});
