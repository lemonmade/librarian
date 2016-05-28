import {StringType, entityType, arrayOfType, BooleanType} from 'librarian/src/types';
import ParamType from '../param';
import TypeType from '../type';

export default {
  name: {type: StringType},
  params: {type: arrayOfType(entityType(ParamType)), default: []},
  async: {type: BooleanType, default: false},
  generator: {type: BooleanType, default: false},
  returns: {type: entityType(TypeType), optional: true},
};
