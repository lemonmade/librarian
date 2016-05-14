import {createTag, createTagContainer} from '..';

describe('tags', () => {
  describe('createTag()', () => {
    describe('.names', () => {
      it('handles a single name', () => {
        expect(createTag({name: 'foo'}))
          .to.have.property('names')
          .that.deep.equals(['foo']);
      });

      it('handles a name and aliases', () => {
        expect(createTag({name: 'foo', aliases: ['bar', 'baz']}))
          .to.have.property('names')
          .that.deep.equals(['foo', 'bar', 'baz']);
      });
    });

    describe('.process', () => {
      it('attaches the process function as a method', () => {
        const processTag = sinon.spy();
        const tag = createTag({name: 'foo', process: processTag});
        tag.process();
        expect(processTag).to.have.been.calledOn(tag);
      });
    });
  });

  describe('createTagContainer()', () => {
    const tagOne = createTag({name: 'foo'});
    const tagTwo = createTag({name: 'bar', aliases: ['baz']});

    describe('.names', () => {
      it('is an empty array with no tags', () => {
        expect(createTagContainer())
          .to.have.property('names')
          .that.is.empty;
      });

      it('is an array of all tag names', () => {
        expect(createTagContainer([tagOne, tagTwo]))
          .to.have.property('names')
          .that.deep.equals([...tagOne.names, ...tagTwo.names]);
      });
    });

    describe('.tag()', () => {
      it('returns nothing for no matching tag', () => {
        expect(createTagContainer([tagOne]).tag('bar')).to.be.undefined;
      });

      it('returns the tag that includes the name', () => {
        expect(createTagContainer([tagOne, tagTwo]).tag('baz')).to.equal(tagTwo);
      });
    });

    describe('.tagMatcher', () => {
      it('returns a non-capturing group that matches all contained names', () => {
        const container = createTagContainer([tagOne, tagTwo]);
        expect(container)
          .to.have.property('tagMatcher')
          .that.deep.equals(`(?:${container.names.join('|')})`);
      });
    });
  });
});
