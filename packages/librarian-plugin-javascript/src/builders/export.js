export default function exportBuilder(path, state) {
  state.builder.get(path.get('declaration'), state);
}

exportBuilder.handles = (path) => path.isExportDefaultDeclaration();
