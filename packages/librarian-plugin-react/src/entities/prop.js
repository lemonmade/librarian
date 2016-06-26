import define from 'librarian/src/entities';
import {StringType, BooleanType} from 'librarian/src/types';
import {TypeType} from 'librarian-plugin-javascript/src/entities';

export default define({
  name: 'Prop',
  source: 'React',
  properties: () => ({
    name: {type: StringType},
    type: {type: TypeType},
    isRequired: {type: BooleanType, default: false},
  }),
});
