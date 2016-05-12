import {createTag} from 'librarian/tags';
import {TypeType} from '../entities';

export default createTag({
  name: 'returns',
  aliases: ['return'],
  process(content) {
    return TypeType({type: content});
  },
});
