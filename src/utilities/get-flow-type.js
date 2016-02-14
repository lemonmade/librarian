/* @flow */

const flowTypeMappings = {
  AnyTypeAnnotation: 'any',
  BooleanTypeAnnotation: 'boolean',
  MixedTypeAnnotation: 'mixed',
  NumberTypeAnnotation: 'number',
  StringTypeAnnotation: 'string',
  VoidTypeAnnotation: 'void',
};

export default function getFlowType(node): string {
  return flowTypeMappings[node.type];
}
