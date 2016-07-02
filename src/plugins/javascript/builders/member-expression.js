import {getMember} from './utilities';

export default function memberExpressionBuilder(path, state) {
  const objectResult = state.builder.get(path.get('object'), state);
  const property = path.get('property.name').node;
  return getMember({name: property, static: true, inEntity: objectResult});
}

memberExpressionBuilder.handles = (path) => (
  path.isMemberExpression() &&
  path.get('property').isIdentifier()
);
