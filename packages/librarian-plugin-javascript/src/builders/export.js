import createID from 'librarian/src/id';
import {ExportType} from '../entities';

export default function exportBuilder(path, state) {
  return ExportType({
    id: createID({module: state.filename, name: 'default'}),
    value: state.builder.get(path.get('declaration'), state),
  });
}

exportBuilder.handles = (path) => path.isExportDefaultDeclaration();
