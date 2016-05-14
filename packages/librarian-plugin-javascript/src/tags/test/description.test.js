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

    it('removes a single newline', () => {
      expect(descriptionTag.process('Foo\nBar')).to.equal('Foo Bar');
    });

    it('preserves multiline newlines', () => {
      expect(descriptionTag.process('Foo\n\nBar')).to.equal('Foo\n\nBar');
    });

    it('trims surrounding whitespace', () => {
      expect(descriptionTag.process('\n\nFoo\n\nBar\n\n')).to.equal('Foo\n\nBar');
    });
  });
});
