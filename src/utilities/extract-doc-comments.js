const DOC_COMMENT_MATCHER = /^\*\s/;
const COMMENT_CLEANER = /(^\s*?\*?\s|\n\s*$)/gm;

export default function extractDocComments(node) {
  const matchingComments = (node.leadingComments || [])
    .filter((comment) => DOC_COMMENT_MATCHER.test(comment));

  if (matchingComments.length === 0) { return null; }

  return matchingComments[matchingComments.length - 1]
    .replace(COMMENT_CLEANER, '');
}
