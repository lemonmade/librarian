import {createTag} from '../../../tags';

export default createTag({
  name: 'description',
  aliases: ['desc'],
  multiple: false,
  process(content) {
    const finalContent = content.join('\n').trim().replace(/([^\n])\n([^\n])/g, '$1 $2');
    return finalContent.length ? finalContent : null;
  },
});
