import {StringType, arrayOfType, BooleanType} from 'librarian/src/types';
import ParamType from '../param';
import TypeType from '../type';

export default {
  name: {type: StringType},
  params: {type: arrayOfType(ParamType), default: []},
  async: {type: BooleanType, default: false},
  generator: {type: BooleanType, default: false},
  returns: {type: TypeType, optional: true},
};
