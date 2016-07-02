import define from '../../../entities';
import {StringType, BooleanType} from '../../../types';
import {TypeType} from '../../javascript/entities';

export default define({
  name: 'Prop',
  source: 'React',
  properties: () => ({
    name: {type: StringType},
    type: {type: TypeType},
    isRequired: {type: BooleanType, default: false},
  }),
});
