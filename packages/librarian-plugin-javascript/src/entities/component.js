import define from 'librarian/src/entities';
import {StringType, BooleanType} from 'librarian/src/types';

const ComponentType = define({
  name: 'Component',
  source: 'React',
  properties: () => ({
    name: {type: StringType, optional: true},
    stateless: {type: BooleanType, default: false},
  }),
});

export default ComponentType;
