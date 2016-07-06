import ClassType from './class';
import FunctionType from './function';
import ValueType from './value';
import PrimitiveType from './primitive';

const additionalEntities = [];

export function addValueEntities(entities) {
  additionalEntities.push(...entities);
}

export function getValueEntities() {
  return additionalEntities.concat([ClassType, FunctionType, ValueType, PrimitiveType]);
}

export function resetValueEntities() {
  additionalEntities.length = 0;
}
