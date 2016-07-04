import {ValueType} from '../entities';

export default function literalBuilder(path, {builder}) {
  const {node: {value}} = path;
  return builder.set(path, ValueType({value}), {isSourcePath: true});
}

literalBuilder.handles = (path) => (
  path.isStringLiteral() ||
  path.isNumericLiteral()
);
