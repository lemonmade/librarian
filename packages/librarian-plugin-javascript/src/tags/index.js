import {createTagContainer} from 'librarian/src/tags';
import returnsTag from './returns';
import descriptionTag from './description';
import paramTag from './param';
import typeTag from './type';

export default createTagContainer([
  returnsTag,
  descriptionTag,
  paramTag,
  typeTag,
]);
