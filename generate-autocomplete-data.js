import {writeFileSync} from 'fs';
import {join} from 'path';
import {load} from './packages/librarian';
import {ComponentType} from './packages/librarian-plugin-shopify/src/entities';
import {componentTransformer} from './packages/librarian-plugin-shopify/src/transformers';

(async () => {
  try {
    const library = await load();
    const components = library
      .filter((entity) => ComponentType.check(entity) && entity.snippet && entity.helper)
      .map((entity) => componentTransformer(entity));
    const autocompleteData = components.map(getComponentData);
    writeFileSync(join(__dirname, '../quilt-completions/data.json'), JSON.stringify({data: autocompleteData}, null, 2));
  } catch (error) {
    console.log(error);
  }
})()

function getComponentData(component) {
  const variationsWithSnippets = component.variations.filter((variation) => variation.snippet);
  return {
    type: 'component',
    description: component.description,
    displayText: component.name,
    snippet: component.snippet,
    helper: component.helper,
    variations: variationsWithSnippets.map(getVariationData),
  };
}

function getVariationData(variation) {
  return {
    displayText: variation.name,
    description: variation.description,
    snippet: variation.snippet,
    options: variation.accepts.map(getOptionData),
  };
}

function getOptionData(option) {
  if (typeof option === 'boolean') {
    return {type: 'boolean', text: String(option)};
  }

  const isSymbol = option.startsWith(':');
  return {
    type: isSymbol ? 'constant' : 'string',
    displayText: option.replace(/^:/, ''),
    snippet: isSymbol ? option : `'${option}'`,
  };
}
