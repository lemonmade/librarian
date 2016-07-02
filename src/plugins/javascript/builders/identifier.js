export default function identifierBuilder(path, state) {
  const {scope, node: {name}} = path;
  if (!scope.hasBinding(name)) { return null; }

  const binding = scope.getBinding(name);
  const {builder} = state;
  return builder.get(binding.path, state);
}

identifierBuilder.handles = (path) => path.isIdentifier();
