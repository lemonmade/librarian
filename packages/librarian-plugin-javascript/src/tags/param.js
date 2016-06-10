import {createTag} from 'librarian/src/tags';
import {typeFromString} from './type';

export default createTag({
  name: 'param',
  aliases: ['argument', 'arg'],
  multiple: true,
  process(content) {
    const params = content.map(paramDetailsFromComment);
    const finalParams = [];

    for (const param of params) {
      const names = param.name ? param.name.split('.') : [];
      if (names.length < 2) {
        finalParams.push(param);
        continue;
      }

      const finalName = names[names.length - 1];
      const nestedNames = names.slice(0, -1);
      let currentParamNamespace = finalParams;

      for (const name of nestedNames) {
        let found = currentParamNamespace.find((otherParam) => otherParam.name === name);
        if (found == null) {
          found = {name, properties: [], elements: []};
          currentParamNamespace.push(found);
        }

        currentParamNamespace = found.properties;
      }

      param.name = finalName;
      currentParamNamespace.push(param);
    }

    return finalParams;
  },
});

const EXTRACTOR = /\s*(?:\{([^\}]*)\})?\s*([\w\.]+)\s*\-?\s*(.*)/;

function paramDetailsFromComment(comment) {
  const match = comment.match(EXTRACTOR);
  return {
    name: match[2],
    description: match[3],
    type: match[1] ? typeFromString(match[1]) : null,
    properties: [],
    elements: [],
  };
}
