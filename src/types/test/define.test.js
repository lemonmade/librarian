import * as graphql from 'graphql';

import defineType from '../define';
import toGraphQL from '../graphql';
import {stringType, numberType, arrayOf, nodeType} from '../base';

describe('defineType()', () => {
  describe('.type', () => {
    it('sets the type on the returned factory', () => {
      expect(defineType('Foo'))
        .to.have.property('type')
        .that.equals('Foo');
    });
  });

  describe('options', () => {
    describe('extends', () => {
      let fooFactory;
      let barFactory;

      beforeEach(() => {
        fooFactory = defineType('Foo', {
          properties: {foo: {type: sinon.stub().returns(true), default: 'foo'}},
          computed: {
            baz: {
              type: sinon.stub().returns(true),
              get() { return 'baz'; },
            },
          },
        });

        barFactory = defineType('Bar', {
          extends: fooFactory,
          properties: {bar: {type: sinon.stub().returns(true), default: 'bar'}},
          computed: {
            qux: {
              type: sinon.stub().returns(true),
              get() { return 'qux'; },
            },
          },
        });
      });

      it('accepts any fields of the extended type', () => {
        const result = barFactory({foo: true});

        expect(result)
          .to.have.property('foo')
          .that.equals(true);
      });

      it('has its extended type’s default values', () => {
        const result = barFactory();

        expect(result)
          .to.have.property('foo')
          .that.equals('foo');
      });

      it('accepts fields of the actual type', () => {
        const result = barFactory({bar: true});

        expect(result)
          .to.have.property('bar')
          .that.equals(true);
      });

      it('has its own default values', () => {
        const result = barFactory();

        expect(result)
          .to.have.property('bar')
          .that.equals('bar');
      });

      it('inherits computed properties from the extended type', () => {
        const result = barFactory();

        expect(result)
          .to.have.property('baz')
          .that.equals('baz');
      });

      it('has its own computed properties', () => {
        const result = barFactory();

        expect(result)
          .to.have.property('qux')
          .that.equals('qux');
      });

      it('handles dynamic properties', () => {
        fooFactory = defineType('Foo', {
          properties: () => ({
            foo: {type: arrayOf(nodeType(fooFactory)), default: []},
          }),
        });

        barFactory = defineType('Bar', {
          extends: fooFactory,
          properties: () => ({
            bar: {type: arrayOf(nodeType(barFactory)), default: []},
          }),
        });

        const result = barFactory({foo: [fooFactory()]});

        expect(result)
          .to.have.property('foo')
          .that.deep.equals([fooFactory()]);
      });
    });

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
        expect(factory({bar}))
          .to.have.property('bar')
          .that.equals(bar);
      });

      it('exposes the default value on the resulting object if no value is provided', () => {
        factory = defineType('Foo', {
          properties: {bar: {type, default: bar}},
        });

        expect(factory())
          .to.have.property('bar')
          .that.equals(bar);
      });

      it('adds a nullable type for optional parameters', () => {
        factory = defineType('Foo', {
          properties: {bar: {type, optional: true}},
        });

        expect(() => factory()).not.to.throw(Error);
      });

      it('rejects an unknown key', () => {
        expect(factory({baz: true})).not.to.have.property('baz');
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
      expect(type._typeConfig.fields()).to.deep.equal(graphQLType._typeConfig.fields);
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
      expect(type._typeConfig.fields()).to.deep.equal(graphQLType._typeConfig.fields);
    });

    it('handles self-referencing types', () => {
      const factory = defineType('Foo', {
        properties: () => ({foo: {type: nodeType(factory)}}),
      });

      const graphQLType = new graphql.GraphQLObjectType({
        name: 'Foo',
        fields: () => ({
          foo: {type: graphQLType},
        }),
      });

      expect(() => toGraphQL(factory)).not.to.throw(Error);
    });
  });

  it('allows self-referencing types', () => {
    const factory = defineType('MyType', {
      properties: () => ({
        subtypes: {type: arrayOf(nodeType(factory)), default: []},
      }),
    });

    expect(() => factory({subtypes: [factory(), factory()]})).not.to.throw(Error);
  });
});
