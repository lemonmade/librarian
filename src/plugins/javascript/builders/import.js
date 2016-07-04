import {dirname} from 'path';
import resolve from 'resolve-from';

export default function importBuilder(path, {filename, config, builder}) {
  const source = path.parentPath.get('source.value').node;
  const absoluteSource = resolve(dirname(config.absolutePath(filename)), source);

  if (absoluteSource == null) {
    return builder.set(path, null);
  }

  const finalSource = config.rootRelative(absoluteSource);
  const sourceModule = builder.getModule(finalSource);

  if (sourceModule == null) {
    return builder.set(path, null);
  }

  if (path.isImportDefaultSpecifier()) {
    const {defaultExport} = sourceModule;
    return builder.set(path, defaultExport && defaultExport.value);
  } else {
    const name = path.get('imported.name').node;
    const matchingExport = sourceModule.exports.find((anExport) => anExport.name === name);
    return builder.set(path, matchingExport && matchingExport.value);
  }
}

importBuilder.handles = (path) => path.isImportDefaultSpecifier() || path.isImportSpecifier();
