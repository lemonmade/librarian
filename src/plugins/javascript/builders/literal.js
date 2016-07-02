import {ValueType} from '../entities';

export default function literalBuilder({node: {value}}) {
  return ValueType({value});
}

literalBuilder.handles = (path) => (
  path.isStringLiteral() ||
  path.isNumericLiteral()
);
