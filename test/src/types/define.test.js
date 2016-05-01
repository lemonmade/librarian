import 'test-helper';
import * as graphql from 'graphql';
import defineType from 'types/define';
import toGraphQL from 'types/graphql';
import {stringType, numberType} from 'types/base';

describe('defineType()', () => {
  describe('.type', () => {
    it('sets the type on the returned factory', () => {
      expect(defineType('Foo'))
        .to.have.property('type')
        .that.equals('Foo');
    });
  });

  describe('options', () => {
    describe('properties', () => {
      let type;
      let factory;
      const bar = 'something';

      beforeEach(() => {
        type = sinon.stub().returns(true);

        factory = defineType('Foo', {
          properties: {bar: {type}},
        });
      });

      it('validates the type of that key when constructed', () => {
        expect(() => factory({bar})).not.to.throw(Error);
        expect(type).to.have.been.called;
      });

      it('throws an error for invalid values', () => {
        type.returns(false);
        expect(() => factory({bar})).to.throw(/Unexpected field value for 'bar'/);
      });

      it('throws an error for computed keys', () => {
        factory = defineType('Foo', {
          properties: {bar: {type}},
          computed: {baz: {type}},
        });

        expect(() => factory({baz: true})).to.throw(/Unexpected assignment of computed property 'baz'/);
      });

      it('exposes the value on the resulting object', () => {
        expect(factory({bar}).bar).to.equal(bar);
      });

      it('exposes the default value on the resulting object if no value is provided', () => {
        factory = defineType('Foo', {
          properties: {bar: {type, default: bar}},
        });

        expect(factory().bar).to.equal(bar);
      });

      it('adds a nullable type for optional parameters', () => {
        factory = defineType('Foo', {
          properties: {bar: {type, optional: true}},
        });

        expect(() => factory()).not.to.throw(Error);
      });
    });

    describe('computed', () => {
      let type;
      let get;
      let factory;
      const bar = 'something';

      beforeEach(() => {
        type = sinon.stub().returns(true);
        get = sinon.stub().returns(bar);

        factory = defineType('Foo', {
          computed: {bar: {type, get}},
        });
      });

      it('calls the getter when accessed', () => {
        const result = factory();
        expect(result.bar).to.equal(bar);
        expect(get).to.have.been.calledOn(result);
      });
    });
  });

  describe('[GRAPHQL]()', () => {
    it('returns an object with fields for the properties', () => {
      const type = toGraphQL(defineType('Foo', {
        properties: {
          bar: {type: stringType},
        },
      }));

      const graphQLType = new graphql.GraphQLObjectType({
        name: 'Foo',
        fields: {
          bar: {type: graphql.GraphQLString},
        },
      });

      expect(type.name).to.equal(graphQLType.name);
      expect(type._typeConfig.fields).to.deep.equal(graphQLType._typeConfig.fields);
    });

    it('returns an object with fields for the computed properties', () => {
      const type = toGraphQL(defineType('Foo', {
        computed: {
          bar: {type: numberType},
        },
      }));

      const graphQLType = new graphql.GraphQLObjectType({
        name: 'Foo',
        fields: {
          bar: {type: graphql.GraphQLFloat},
        },
      });

      expect(type.name).to.equal(graphQLType.name);
      expect(type._typeConfig.fields).to.deep.equal(graphQLType._typeConfig.fields);
    });
  });
});
