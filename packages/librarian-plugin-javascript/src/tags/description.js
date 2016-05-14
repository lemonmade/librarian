import {createTag} from 'librarian/src/tags';

export default createTag({
  name: 'description',
  aliases: ['desc'],
  process(content) {
    const finalContent = content.trim().replace(/\n([^\n])/, ' $1');
    return finalContent.length ? finalContent : null;
  },
});
