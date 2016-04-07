import 'test-helper';
import path from 'path';
import createParser from 'parser';

describe('createParser', () => {
  const files = [
    'components/Button/index.js',
    'components/Button/index.css',
  ];

  let plugin;
  let pluginTwo;
  let parseResult;
  let parseResultTwo;

  beforeEach(() => {
    parseResult = {foo: true};
    parseResultTwo = {bar: true};

    plugin = {
      name: 'MyPlugin',
      test: sinon.stub().returns(false),
      parse: sinon.stub().returns(parseResult),
    };

    pluginTwo = {
      name: 'MyPluginTwo',
      test: sinon.stub().returns(false),
      parse: sinon.stub().returns(parseResultTwo),
    };
  });

  describe('parser', () => {
    it('returns a function', () => {
      expect(createParser()).to.be.a('function');
    });

    it('returns an object with keys for each file', () => {
      const result = createParser()(files);
      files.forEach((file) => {
        expect(result)
          .to.have.property(file)
          .that.is.an('object');
      });
    });

    it('merges results returned from plugins', () => {
      plugin.test.returns(true);
      pluginTwo.test.withArgs(files[1]).returns(true);
      const result = createParser({plugins: [plugin, pluginTwo]})(files);
      expect(result).to.deep.equal({
        [files[0]]: parseResult,
        [files[1]]: {...parseResult, ...parseResultTwo},
      });
    });
  });

  describe('options', () => {
    describe('.plugins', () => {
      it('throws when the plugin does not provide a test method', () => {
        delete plugin.test;
        expect(() => createParser({plugins: [plugin]})).to.throw(Error);
      });

      it('passes the file details to the test method', () => {
        createParser({plugins: [plugin]})(files);
        expect(plugin.test).to.have.callCount(files.length);
        files.forEach((file) => {
          expect(plugin.test).to.have.been.calledWith(file, {
            extension: path.extname(file).replace(/^\./, ''),
          });
        });
      });

      it('does not call the parser when the test returns false', () => {
        createParser({plugins: [plugin]})(files);
        expect(plugin.parse).not.to.have.been.called;
      });

      it('calls the parser with the filename when the test returns true', () => {
        plugin.test.withArgs(files[0]).returns(true);
        createParser({plugins: [plugin]})(files);
        expect(plugin.parse).to.have.been.calledOnce;
        expect(plugin.parse).to.have.been.calledWith(files[0]);
      });
    });
  });
});
