import {createTag} from 'librarian/src/tags';
import {typeFromString} from './type';

export default createTag({
  name: 'returns',
  aliases: ['return'],
  multiple: false,
  process(content) {
    return typeFromString(content[0]);
  },
});
