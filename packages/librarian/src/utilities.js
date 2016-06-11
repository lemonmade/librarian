export function getTagsFromCommentBlock(commentBlock, {tags}) {
  const finalCommentBlock = new RegExp(`^@${tags.tagMatcher}`).test(commentBlock)
    ? commentBlock
    : `@description ${commentBlock}`;

  const intermediaryTags = finalCommentBlock
    .replace(new RegExp(`(@${tags.tagMatcher})`, 'g'), 'COMMENT_BLOCK>>>$1')
    .split('COMMENT_BLOCK>>>')
    .reduce((allTags, tagComment) => {
      const tagMatcher = new RegExp(`^@(${tags.tagMatcher})\\s?`);
      const tagMatch = tagComment.match(tagMatcher);
      if (tagMatch) {
        const name = tagMatch[1];
        allTags[name] = allTags[name] || [];
        allTags[name].push(tagComment.replace(tagMatcher, ''));
      }
      return allTags;
    }, {});

  return Object
    .keys(intermediaryTags)
    .reduce((finalTags, name) => (
      {...finalTags, [name]: tags.tag(name).process(intermediaryTags[name])}
    ), {});
}
