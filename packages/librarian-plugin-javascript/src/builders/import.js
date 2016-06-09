import proxy from 'librarian/src/proxy';

export default function importBuilder(path) {
  const source = path.parentPath.get('source.value').node;

  if (path.isImportDefaultSpecifier()) {
    return proxy({module: source, name: 'default'});
  } else {
    return proxy({
      module: source,
      name: path.get('imported.name').node,
    });
  }
}

importBuilder.handles = (path) => path.isImportDefaultSpecifier() || path.isImportSpecifier();
