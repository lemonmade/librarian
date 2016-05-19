import define from 'librarian/src/entities';
import {stringType, nodeType, arrayOf, booleanType} from 'librarian/src/types';
import TypeType from './type';
import BaseType from './base';

const ValueType = define('JavaScriptValue', {
  extends: BaseType,
  properties: () => ({
    name: {type: stringType},
    type: {type: TypeType, optional: true},
    value: {type: stringType},
    members: {type: arrayOf(nodeType(ValueType)), default: []},
    isArray: {type: booleanType, default: false},
    isObject: {type: booleanType, default: false},
  }),
});

export default ValueType;
