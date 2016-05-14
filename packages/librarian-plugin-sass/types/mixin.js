import define from 'librarian/entities';
import {stringType, nodeType, arrayOf} from 'librarian/types';
import ParamType from './param';

export default define('Param', {
  properties: {
    name: {type: stringType, optional: true},
    params: {type: arrayOf(nodeType(ParamType)), default: []},
  },
});
