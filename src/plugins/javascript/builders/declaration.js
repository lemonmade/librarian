export default function declarationBuilder(path, state) {
  const {builder} = state;
  return builder.set(path, builder.get(path.get('declarations.0.init'), state));
}

declarationBuilder.handles = (path) => (
  path.isVariableDeclaration() &&
  path.node.declarations.length
);
