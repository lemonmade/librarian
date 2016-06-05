export default function exportBuilder(path, state) {
  return state.builder.get(path.get('declaration'), state);
}

exportBuilder.handles = (path) => path.isExportDefaultDeclaration();
