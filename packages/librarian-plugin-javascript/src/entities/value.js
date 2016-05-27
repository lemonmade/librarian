import define from 'librarian/src/entities';
import {stringType, nodeType, arrayOf, booleanType} from 'librarian/src/types';
import TypeType from './type';
import {basicProperties, exportProperties} from './common';

const ValueType = define({
  name: 'JavaScript:Value',
  properties: () => ({
    ...basicProperties,
    ...exportProperties,
    name: {type: stringType},
    type: {type: nodeType(TypeType), optional: true},
    value: {type: stringType},
    members: {type: arrayOf(nodeType(ValueType)), default: []},
    isArray: {type: booleanType, default: false},
    isObject: {type: booleanType, default: false},
  }),
});

export default ValueType;
