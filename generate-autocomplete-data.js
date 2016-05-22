import {writeFileSync} from 'fs';
import {ComponentType} from './packages/librarian-plugin-shopify/src/entities';

export default function generateAutocompleteData({destination}) {
  return function generator({library}) {
    console.log(`Generating autocomplete data to ${destination}`);

    const components = library.filter((entity) =>
      ComponentType.check(entity) && entity.snippet && entity.helper
    );
    const autocompleteData = components.map(getComponentData);
    writeFileSync(destination, JSON.stringify({data: autocompleteData}, null, 2));
  };
}

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
