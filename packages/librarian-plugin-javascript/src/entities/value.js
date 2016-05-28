import define from 'librarian/src/entities';
import {StringType, entityType, arrayOfType, BooleanType} from 'librarian/src/types';
import TypeType from './type';
import {basicProperties, exportProperties} from './common';

const ValueType = define({
  name: 'JavaScript:Value',
  properties: () => ({
    ...basicProperties,
    ...exportProperties,
    name: {type: StringType},
    type: {type: entityType(TypeType), optional: true},
    value: {type: StringType},
    members: {type: arrayOfType(entityType(ValueType)), default: []},
    isArray: {type: BooleanType, default: false},
    isObject: {type: BooleanType, default: false},
  }),
});

export default ValueType;
