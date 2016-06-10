import {dirname} from 'path';
import resolve from 'resolve';
import proxy from '../proxy';

export default function importBuilder(path, {filename, config}) {
  const source = path.parentPath.get('source.value').node;
  const absoluteSource = resolve.sync(source, {
    basedir: dirname(config.absolutePath(filename)),
  });
  const finalSource = config.rootRelative(absoluteSource);

  if (path.isImportDefaultSpecifier()) {
    return proxy({module: finalSource, name: 'default'});
  } else {
    return proxy({
      module: finalSource,
      name: path.get('imported.name').node,
    });
  }
}

importBuilder.handles = (path) => path.isImportDefaultSpecifier() || path.isImportSpecifier();
