import createID from '../../../id';
import {ExportType} from '../entities';

export default function exportBuilder(path, state) {
  const {builder} = state;
  const isNamedExport = path.isExportNamedDeclaration();

  if (isNamedExport && path.has('declaration')) {
    const value = builder.get(path.get('declaration'), state, {sourcePath: path});

    return builder.set(path, ExportType({
      value,
      name: value.name,
      id: createID({module: state.filename, name: value.name}),
    }), {isSourcePath: true});
  }

  if (isNamedExport && path.has('specifiers')) {
    const results = path.get('specifiers').map((specifierPath) => {
      const local = specifierPath.get('local');
      const value = state.builder.get(local, state, {sourcePath: path});
      const name = specifierPath.has('exported')
        ? specifierPath.get('exported.name').node
        : local.get('name').node;

      return builder.set(specifierPath, ExportType({
        value,
        name,
        id: createID({module: state.filename, name}),
      }), {isSourcePath: true});
    });

    return builder.set(path, results);
  }

  return builder.set(path, ExportType({
    id: createID({module: state.filename, name: 'default'}),
    value: builder.get(path.get('declaration'), state, {sourcePath: path}),
  }), {isSourcePath: true});
}

exportBuilder.handles = (path) => (
  path.isExportDefaultDeclaration() ||
  path.isExportNamedDeclaration()
);
