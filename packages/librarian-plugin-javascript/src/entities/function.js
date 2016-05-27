import define from 'librarian/src/entities';
import {stringType, nodeType, arrayOf, booleanType} from 'librarian/src/types';
import {basicProperties, exportProperties} from './common';
import ParamType from './param';
import TypeType from './type';

export const properties = {
  name: {type: stringType},
  params: {type: arrayOf(nodeType(ParamType)), default: []},
  async: {type: booleanType, default: false},
  generator: {type: booleanType, default: false},
  returns: {type: nodeType(TypeType), optional: true},
};

export default define({
  name: 'JavaScript:Function',
  properties: {
    ...basicProperties,
    ...exportProperties,
    ...properties,
  },
});
