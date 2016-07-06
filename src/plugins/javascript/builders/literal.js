import {PrimitiveType} from '../entities';

export default function literalBuilder(path, {builder}) {
  const value = path.isNullLiteral() ? null : path.node.value;
  return builder.set(path, PrimitiveType({value}), {isSourcePath: true});
}

literalBuilder.handles = (path) => (
  path.isStringLiteral() ||
  path.isNumericLiteral() ||
  path.isBooleanLiteral() ||
  path.isNullLiteral()
);
