import createID from '../../../id';
import {ModuleType} from '../entities';

export default function exportBuilder(path, state) {
  const moduleExports = [];

  function handleExport(exportPath, exportState) {
    const results = exportState.builder.get(exportPath, exportState);
    if (Array.isArray(results)) {
      moduleExports.push(...results);
    } else {
      moduleExports.push(results);
    }
  }

  path.traverse({
    ExportDefaultDeclaration: handleExport,
    ExportNamedDeclaration: handleExport,
  }, state);

  return ModuleType({
    id: createID({module: state.filename}),
    name: state.filename,
    exports: moduleExports,
  });
}

exportBuilder.handles = (path) => path.isProgram();
