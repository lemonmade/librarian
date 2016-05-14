import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiSubset from 'chai-subset';
import 'babel-polyfill';

chai.use(sinonChai);
chai.use(chaiSubset);

global.expect = expect;
global.sinon = sinon;
