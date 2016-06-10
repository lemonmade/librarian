import {ModuleType} from '../entities';

export default function exportBuilder(path, state) {
  const moduleExports = [];

  path.traverse({
    ExportDefaultDeclaration(exportPath, exportState) {
      moduleExports.push(exportState.builder.get(exportPath, exportState));
    },
  }, state);

  console.log(moduleExports);

  return ModuleType({
    name: state.filename,
    exports: moduleExports,
  });
}

exportBuilder.handles = (path) => path.isProgram();
