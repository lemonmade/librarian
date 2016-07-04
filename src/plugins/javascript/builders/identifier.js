export default function identifierBuilder(path, state) {
  const {scope, node: {name}} = path;
  const {builder} = state;

  return builder.set(
    path,
    scope.hasBinding(name) ? builder.get(scope.getBinding(name).path, state) : null
  );
}

identifierBuilder.handles = (path) => path.isIdentifier();
