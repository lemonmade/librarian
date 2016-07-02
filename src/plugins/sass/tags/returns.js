import {createTag} from '../../../tags';

export default createTag({
  name: 'returns',
  aliases: ['return'],
  multiple: false,
  process(content) {
    return typeFromString(content[0]);
  },
});
