import createID from '../../../id';
import {ExportType} from '../entities';

export default function exportBuilder(path, state) {
  const isNamedExport = path.isExportNamedDeclaration();
  if (isNamedExport && path.has('declaration')) {
    const value = state.builder.get(path.get('declaration'), state, {sourcePath: path});

    return ExportType({
      value,
      name: value.name,
      id: createID({module: state.filename, name: value.name}),
    });
  }

  if (isNamedExport && path.has('specifiers')) {
    return path.get('specifiers').map((specifierPath) => {
      const local = specifierPath.get('local');
      const value = state.builder.get(local, state, {sourcePath: path});
      const name = specifierPath.has('exported')
        ? specifierPath.get('exported.name').node
        : local.get('name').node;

      return ExportType({
        value,
        name,
        id: createID({module: state.filename, name}),
      });
    });
  }

  return ExportType({
    id: createID({module: state.filename, name: 'default'}),
    value: state.builder.get(path.get('declaration'), state, {sourcePath: path}),
  });
}

exportBuilder.handles = (path) => (
  path.isExportDefaultDeclaration() ||
  path.isExportNamedDeclaration()
);
