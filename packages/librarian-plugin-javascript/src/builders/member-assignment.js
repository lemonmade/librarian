import {ValueType, MemberType} from '../entities';

export default function memberAssignmentBuilder(path, state) {
  const assignment = path.get('expression');
  const left = assignment.get('left');
  const entity = state.builder.get(left.get('object'), state);
  if (entity == null) { return; }

  entity.members.push(
    MemberType({
      static: true,
      key: ValueType({value: left.get('property.name').node}),
      value: state.builder.get(assignment.get('right'), state),
    })
  );
}

memberAssignmentBuilder.handles = (path) => (
  path.isExpressionStatement() &&
  path.get('expression').isAssignmentExpression() &&
  path.get('expression.left').isMemberExpression()
);
