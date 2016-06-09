import toGraphQL, {GRAPHQL} from '../graphql';

describe('graphql', () => {
  describe('GRAPHQL', () => {
    it('exposes a symbol for naming GraphQL-generating methods', () => {
      expect(typeof GRAPHQL).to.equal('symbol');
    });
  });

  describe('toGraphQL()', () => {
    let method;
    let object;
    let result;

    beforeEach(() => {
      result = {};
      method = sinon.stub().returns(result);
      object = {[GRAPHQL]: method};
    });

    it('calls the graphQL method if present and returns the result', () => {
      expect(toGraphQL(object)).to.equal(result);
    });

    it('throws an error if no graphQL method is present', () => {
      expect(() => toGraphQL({})).to.throw(/object does not have a GraphQL method./i);
    });

    it('caches lookups for subsequent calls', () => {
      const resultOne = toGraphQL(object);
      const resultTwo = toGraphQL(object);
      expect(resultOne).to.equal(resultTwo);
      expect(method).to.have.been.calledOnce;
    });
  });
});
