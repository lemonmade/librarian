import ClassType from './class';
import FunctionType from './function';
import ValueType from './value';

const additionalEntities = [];

export function addValueEntities(entities) {
  additionalEntities.push(...entities);
}

export function getValueEntities() {
  return additionalEntities.concat([ClassType, FunctionType, ValueType]);
}

export function resetValueEntities() {
  additionalEntities.length = 0;
}
