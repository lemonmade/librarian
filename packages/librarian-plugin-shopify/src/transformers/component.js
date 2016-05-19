import {ComponentType} from '../entities';
import variationFromObject from './variation';

export default function classFromObject(object) {
  const {variations, description} = object;
  const hasVariations = (variations.length > 0);
  const snippet = (
    object.snippet ||
    (object.helper && `<%= ${object.helper}${hasVariations ? '(${1:})' : ''} %>\n\t\${2:Content}\n<% end %>`)
  );

  return ComponentType({
    ...object,
    snippet,
    description: description && description.replace(/([^\n])\n([^\n])/g, '$1 $2'),
    variations: variations.map(variationFromObject),
  });
}
