import createID from 'librarian/src/id';

export default function exportBuilder(path, state) {
  const result = state.builder.get(path.get('declaration'), state);
  result.id = createID({module: state.filename, name: 'default'});
}

exportBuilder.handles = (path) => path.isExportDefaultDeclaration();
