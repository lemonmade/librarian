import {createTagContainer} from 'librarian/src/tags';
import returnsTag from './returns';
import descriptionTag from './description';

export default createTagContainer([
  returnsTag,
  descriptionTag,
]);
