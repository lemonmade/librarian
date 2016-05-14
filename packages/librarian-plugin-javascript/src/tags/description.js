import {createTag} from 'librarian/src/tags';

export default createTag({
  name: 'description',
  aliases: ['desc'],
  process(content) {
    const finalContent = content.join('\n').trim().replace(/([^\n])\n([^\n])/, '$1 $2');
    return finalContent.length ? finalContent : null;
  },
});
