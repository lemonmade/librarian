import {addMemberToEntity} from './utilities';
import {ValueType, MemberType} from '../entities';

export default function memberAssignmentBuilder(path, state) {
  const assignment = path.get('expression');
  const left = assignment.get('left');
  const entity = state.builder.get(left.get('object'), state);
  if (entity == null) { return null; }

  const newMember = MemberType({
    static: true,
    key: ValueType({value: left.get('property.name').node}),
  });

  state.builder.afterAdd(() => {
    newMember.value = state.builder.get(assignment.get('right'), state);
  });

  addMemberToEntity({member: newMember, entity});
  return newMember;
}

memberAssignmentBuilder.handles = (path) => (
  path.isExpressionStatement() &&
  path.get('expression').isAssignmentExpression() &&
  path.get('expression.left').isMemberExpression()
);
