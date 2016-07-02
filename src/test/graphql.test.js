import createGraphQLConverter, {TO_GRAPHQL} from '../graphql';

describe('graphql', () => {
  describe('toGraphQL()', () => {
    let method;
    let object;
    let result;
    let toGraphQL;

    beforeEach(() => {
      result = {};
      method = sinon.stub().returns(result);
      object = {[TO_GRAPHQL]: method};
      toGraphQL = createGraphQLConverter();
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
