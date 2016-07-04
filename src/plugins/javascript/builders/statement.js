export default function expressionStatementBuilder(path, state) {
  const {builder} = state;
  return builder.set(path, builder.get(path.get('expression'), state, {sourcePath: path}));
}

expressionStatementBuilder.handles = (path) => path.isExpressionStatement();
