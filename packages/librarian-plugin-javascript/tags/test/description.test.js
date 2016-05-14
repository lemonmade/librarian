import descriptionTag from '../description';

describe('descriptionTag', () => {
  it('has the correct name', () => {
    expect(descriptionTag)
      .to.have.property('name')
      .that.equals('description');
  });

  it('has the correct aliases', () => {
    expect(descriptionTag)
      .to.have.property('names')
      .that.deep.equals(['description', 'desc']);
  });

  describe('.process()', () => {
    it('returns null when there is no description', () => {
      expect(descriptionTag.process('\n\n')).to.be.null;
    });
  });
});
