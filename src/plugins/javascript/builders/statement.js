export default function expressionStatementBuilder(path, state) {
  const {builder} = state;
  return builder.set(path, builder.get(path.get('expression'), state));
}

expressionStatementBuilder.handles = (path) => path.isExpressionStatement();
