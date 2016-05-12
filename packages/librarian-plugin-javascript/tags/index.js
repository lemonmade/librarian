import {createTagContainer} from 'librarian/tags';
import returnsTag from './returns';
import descriptionTag from './description';

export default createTagContainer([
  returnsTag,
  descriptionTag,
]);
