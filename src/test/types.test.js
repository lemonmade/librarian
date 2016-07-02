import * as graphql from 'graphql';

import {
  StringType,
  NumberType,
} from '../types';

import createGraphQLConverter from '../graphql';

describe('types', () => {
  let toGraphQL;

  beforeEach(() => {
    toGraphQL = createGraphQLConverter();
  });

  describe('StringType', () => {
    describe('.parse()', () => {
      it('renders values as strings', () => {
        expect(StringType.parse('foo')).to.equal('foo');
        expect(StringType.parse(42)).to.equal('42');
      });
    });

    describe('.check()', () => {
      it('passes strings', () => {
        expect(StringType.check('foo')).to.be.true;
        expect(StringType.check('')).to.be.true;
      });

      it('fails non-strings', () => {
        expect(StringType.check(42)).to.be.false;
        expect(StringType.check(null)).to.be.false;
        expect(StringType.check(['foo'])).to.be.false;
        expect(StringType.check(true)).to.be.false;
        expect(StringType.check({})).to.be.false;
      });
    });

    describe('[GRAPHQL]()', () => {
      it('returns a GraphQL String', () => {
        expect(toGraphQL(StringType)).to.equal(graphql.GraphQLString);
      });
    });
  });

  describe('NumberType', () => {
    describe('.parse()', () => {
      it('renders values as numbers', () => {
        expect(NumberType.parse(42)).to.equal(42);
        expect(NumberType.parse('42')).to.equal(42);
        expect(NumberType.parse('foo')).to.equal(null);
      });
    });

    describe('.check()', () => {
      it('passes numbers', () => {
        expect(NumberType.check(42)).to.be.true;
      });

      it('fails non-numbers', () => {
        expect(NumberType.check('42')).to.be.false;
        expect(NumberType.check(null)).to.be.false;
        expect(NumberType.check([42])).to.be.false;
        expect(NumberType.check(true)).to.be.false;
        expect(NumberType.check({})).to.be.false;
      });
    });

    describe('[GRAPHQL]()', () => {
      it('returns a GraphQL Float', () => {
        expect(toGraphQL(NumberType)).to.equal(graphql.GraphQLFloat);
      });
    });
  });
});
