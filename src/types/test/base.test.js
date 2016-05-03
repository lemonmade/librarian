import * as graphql from 'graphql';

import {
  stringType,
  numberType,
  integerType,
  booleanType,
  enumType,
  arrayOf,
  oneOf,
} from '../base';
import toGraphQL from '../graphql';

describe('base types', () => {
  describe('stringType()', () => {
    it('accepts a string', () => {
      expect(stringType('foo bar')).to.be.true;
    });

    it('rejects anything else', () => {
      expect(stringType(42)).to.be.false;
      expect(stringType([])).to.be.false;
      expect(stringType(null)).to.be.false;
    });

    describe('[GRAPHQL]()', () => {
      it('generates the correct type', () => {
        expect(toGraphQL(stringType)).to.deep.equal(graphql.GraphQLString);
      });
    });
  });

  describe('numberType()', () => {
    it('accepts a number', () => {
      expect(numberType(42)).to.be.true;
      expect(numberType(42.2)).to.be.true;
      expect(numberType(0)).to.be.true;
      expect(numberType(-42)).to.be.true;
    });

    it('rejects anything else', () => {
      expect(numberType('foo bar')).to.be.false;
      expect(numberType([])).to.be.false;
      expect(numberType({})).to.be.false;
      expect(numberType(null)).to.be.false;
    });

    describe('[GRAPHQL]()', () => {
      it('generates the correct type', () => {
        expect(toGraphQL(numberType)).to.deep.equal(graphql.GraphQLFloat);
      });
    });
  });

  describe('integerType()', () => {
    it('accepts a integer', () => {
      expect(integerType(42)).to.be.true;
      expect(integerType(0)).to.be.true;
      expect(integerType(-42)).to.be.true;
    });

    it('rejects anything else', () => {
      expect(integerType('foo bar')).to.be.false;
      expect(integerType([])).to.be.false;
      expect(integerType({})).to.be.false;
      expect(integerType(null)).to.be.false;
      expect(integerType(42.2)).to.be.false;
    });

    describe('[GRAPHQL]()', () => {
      it('generates the correct type', () => {
        expect(toGraphQL(integerType)).to.deep.equal(graphql.GraphQLInt);
      });
    });
  });

  describe('booleanType()', () => {
    it('accepts a boolean', () => {
      expect(booleanType(true)).to.be.true;
      expect(booleanType(false)).to.be.true;
    });

    it('rejects anything else', () => {
      expect(booleanType('foo bar')).to.be.false;
      expect(booleanType([])).to.be.false;
      expect(booleanType({})).to.be.false;
      expect(booleanType(null)).to.be.false;
      expect(booleanType(42)).to.be.false;
    });

    describe('[GRAPHQL]()', () => {
      it('generates the correct type', () => {
        expect(toGraphQL(booleanType)).to.deep.equal(graphql.GraphQLBoolean);
      });
    });
  });

  describe('arrayOf()', () => {
    it('accepts an empty array', () => {
      const validator = arrayOf(() => false);
      expect(validator([])).to.be.true;
    });

    it('accepts an array full of matches', () => {
      const validator = arrayOf(() => true);
      expect(validator(['foo', 42])).to.be.true;
    });

    it('rejects an array that does not fully match', () => {
      const validator = arrayOf((val) => val === 'foo');
      expect(validator(['foo', 42])).to.be.false;
    });

    it('rejects anything other than an array', () => {
      const validator = arrayOf(() => true);
      expect(validator('foo bar')).to.be.false;
      expect(validator(42)).to.be.false;
      expect(validator({})).to.be.false;
      expect(validator(null)).to.be.false;
    });

    describe('[GRAPHQL]()', () => {
      it('generates the correct type', () => {
        expect(toGraphQL(arrayOf(stringType))).to.deep.equal(
          new graphql.GraphQLList(graphql.GraphQLString)
        );
      });
    });
  });

  describe('oneOf()', () => {
    it('accepts anything matching one of the passed types', () => {
      const validator = oneOf({name: 'Union', types: [() => false, () => false, () => true]});
      expect(validator('foo')).to.be.true;
    });

    it('rejects anything not matching one of the passed types', () => {
      const validator = oneOf({name: 'Union', types: [() => false, () => false]});
      expect(validator('foo')).to.be.false;
    });

    describe('[GRAPHQL]()', () => {
      it('generates the correct type');
    });
  });

  describe('enumType()', () => {
    it('accepts any value included in the enum', () => {
      const validator = enumType({name: 'Enum', types: ['foo', 'bar']});
      expect(validator('foo')).to.be.true;
      expect(validator('bar')).to.be.true;
    });

    it('rejects any values outside the enum', () => {
      const validator = enumType({name: 'Enum', types: ['foo', 'bar']});
      expect(validator('baz')).to.be.false;
      expect(validator(null)).to.be.false;
      expect(validator(true)).to.be.false;
      expect(validator(42)).to.be.false;
      expect(validator(['foo', 'bar'])).to.be.false;
    });

    describe('[GRAPHQL]()', () => {
      it('generates the correct type');
    });
  });
});
