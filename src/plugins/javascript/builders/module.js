import createID from '../../../id';
import {ModuleType} from '../entities';

export default function exportBuilder(path, state) {
  const moduleExports = [];
  const {builder} = state;

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

  return builder.set(path, ModuleType({
    id: createID({module: state.filename}),
    name: state.filename,
    exports: moduleExports,
  }), {isSourcePath: true});
}

exportBuilder.handles = (path) => path.isProgram();
