import {createTag} from 'librarian/src/tags';

export default createTag({
  name: 'returns',
  aliases: ['return'],
  multiple: false,
  process(content) {
    return typeFromString(content[0]);
  },
});
