export default function expressionStatementBuilder(path, state) {
  return state.builder.get(path.get('expression'), state, {sourcePath: path});
}

expressionStatementBuilder.handles = (path) => path.isExpressionStatement();
