import plugin from '../../plugin';
import processSass from './processor';
import {MixinType, FunctionType, VariableType, PlaceholderType} from './entities';

export default plugin('Sass', ({nested = false}) => ({
  setup({library}) {
    library.namespace(nested ? 'sass' : library.root, (namespace) => {
      namespace.entities({name: 'mixins', type: MixinType});
      namespace.entities({name: 'functions', type: FunctionType});
      namespace.entities({name: 'variables', type: VariableType});
      namespace.entities({name: 'placeholders', type: PlaceholderType});
    });
  },

  shouldProcess({filename}) { return /.scss$/.test(filename); },
  process: processSass,
}));
