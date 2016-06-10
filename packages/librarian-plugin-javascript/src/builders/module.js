import createID from 'librarian/src/id';
import {ModuleType} from '../entities';

export default function exportBuilder(path, state) {
  const moduleExports = [];

  path.traverse({
    ExportDefaultDeclaration(exportPath, exportState) {
      moduleExports.push(exportState.builder.get(exportPath, exportState));
    },
  }, state);

  return ModuleType({
    id: createID({module: state.filename}),
    name: state.filename,
    exports: moduleExports,
  });
}

exportBuilder.handles = (path) => path.isProgram();
