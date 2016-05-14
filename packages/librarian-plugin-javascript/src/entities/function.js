import define from 'librarian/src/entities';
import {stringType, nodeType, arrayOf, booleanType} from 'librarian/src/types';
import ParamType from './param';
import TypeType from './type';
import BaseType from './base';

export default define('Function', {
  extends: BaseType,
  properties: {
    name: {type: stringType},
    params: {type: arrayOf(nodeType(ParamType)), default: []},
    async: {type: booleanType, default: false},
    generator: {type: booleanType, default: false},
    returns: {type: nodeType(TypeType), optional: true},
  },
});
