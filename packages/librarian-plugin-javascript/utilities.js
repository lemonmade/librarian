export function locationFromPath({node: {loc: {start, end}}}, {filename}) {
  return {
    file: filename,
    start: {line: start.line, column: start.column},
    end: {line: end.line, column: end.column},
  };
}

export function exportDetailsFromPath(path, {name}) {
  const exportPath = path.parentPath;
  if (exportPath.isExportDefaultDeclaration()) {
    return {default: true};
  } else if (exportPath.isExportNamedDeclaration()) {
    return {default: false, name};
  } else {
    return null;
  }
}

const SINGLE_LINE_COMMENT = /^\/\s?/;
const MULTILINE_COMMENT = /^\*\n/;

export function getCommentBlockForPath(path) {
  const commentNodes = path.get('leadingComments');
  if (!commentNodes.length) { return ''; }

  const matchingComments = [];
  const comments = commentNodes
    .map(({node: {value}}) => value)
    .reverse();

  for (const comment of comments) {
    if (SINGLE_LINE_COMMENT.test(comment)) {
      matchingComments.unshift(comment.replace(SINGLE_LINE_COMMENT, ''));
    } else if (matchingComments.length === 0 && MULTILINE_COMMENT.test(comment)) {
      matchingComments.push(comment.replace(/^\s?\*\s?/gm, ''));
      break;
    } else {
      break;
    }
  }

  return matchingComments.join('\n');
}

export function getTagsFromCommentBlock(commentBlock, {tags}) {
  const finalCommentBlock = new RegExp(`^@${tags.tagMatcher}`).test(commentBlock)
    ? commentBlock
    : `@description ${commentBlock}`;

  return finalCommentBlock
    .replace(new RegExp(`(@${tags.tagMatcher})`, 'g'), 'COMMENT_BLOCK>>>$1')
    .split('COMMENT_BLOCK>>>')
    .reduce((allTags, tagComment) => {
      const tagMatcher = new RegExp(`^@(${tags.tagMatcher})\\s?`);
      const tagMatch = tagComment.match(tagMatcher);
      if (tagMatch) {
        const tag = tags.tag(tagMatch[1]);
        allTags[tag.name] = tag.process(tagComment.replace(tagMatcher, ''));
      }
      return allTags;
    }, {});
}
