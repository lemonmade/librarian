import {FunctionType} from '../entities';
import paramFromPath from './param';
import typeFromPath from './type';
import {locationFromPath, exportDetailsFromPath} from '../utilities';

export default function functionFromPath(functionPath, state) {
  const name = functionPath.get('id.name').node;

  return FunctionType({
    name,
    params: functionPath.get('params').map(paramFromPath),
    location: locationFromPath(functionPath, state),
    export: exportDetailsFromPath(functionPath, {name}),
    returns: functionPath.has('returnType') ? typeFromPath(functionPath.get('returnType')) : null,
  });
}
