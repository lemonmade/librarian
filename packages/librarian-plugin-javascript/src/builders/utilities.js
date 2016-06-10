import {isProxy} from 'librarian/src/proxy';

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
