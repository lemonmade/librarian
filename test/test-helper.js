import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiSubset from 'chai-subset';
import 'babel-polyfill';

chai.use(sinonChai);
chai.use(chaiSubset);

chai.use(({assert, Assertion}) => {
  Assertion.addMethod('entityOfType', function(Type) {
    assert(Type.check(this._obj), `Expected entity to be of type ${Type.type}, actual type was ${this._obj.__type}`);
  });

  Assertion.addMethod('properties', function(descriptor) {
    for (const [property, value] of Object.entries(descriptor)) {
      new Assertion(this._obj).to.have.property(property).that.equals(value);
    }
  });
});

global.expect = expect;
global.sinon = sinon;
