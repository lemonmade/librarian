export function locationFromPath({node: {loc: {start, end}}}) {
  return {
    start: {line: start.line, column: start.column},
    end: {line: end.line, column: end.column},
  };
}
