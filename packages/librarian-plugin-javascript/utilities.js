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
