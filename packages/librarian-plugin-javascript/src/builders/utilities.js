import {isProxy} from 'librarian/src/proxy';

export function getAllUsages({name, scope}) {
  if (!name) { return []; }

  const binding = scope.getBinding(name);
  if (!binding) { return []; }

  return binding
    .referencePaths
    .filter((path) => Boolean(path))
    .map((path) => getNearestStatementPath(path));
}

export function getNearestStatementPath(path) {
  while (path && !path.isStatement()) {
    path = path.parentPath;
  }

  return path;
}

export function getMember({name, static: isStatic = false, inEntity: entity}) {
  if (isProxy(entity)) {
    return entity.getMember({name, static: isStatic});
  } else if (Array.isArray(entity.members)) {
    return entity.members.find((member) => member.name === name && member.isStatic === isStatic);
  } else {
    return null;
  }
}

export function addMemberToEntity({member, entity}) {
  if (!entity || !member || !Array.isArray(entity.members)) { return; }

  entity.members.push(member);
  member.memberOf = entity;
}

export function locationFromPath({node: {loc: {start, end}}}, {filename}) {
  return {
    file: filename,
    start: {line: start.line, column: start.column},
    end: {line: end.line, column: end.column},
  };
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
