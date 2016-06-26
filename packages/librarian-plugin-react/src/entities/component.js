import define from 'librarian/src/entities';
import {StringType, BooleanType, arrayOfType} from 'librarian/src/types';

import PropType from './prop';

const ComponentType = define({
  name: 'Component',
  source: 'React',
  properties: () => ({
    name: {type: StringType, optional: true},
    stateless: {type: BooleanType, default: false},
    props: {type: arrayOfType(PropType), default: []},
  }),
});

export default ComponentType;
