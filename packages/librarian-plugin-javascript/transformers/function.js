import {FunctionType} from '../entities';
import paramFromPath from './param';
import {locationFromPath} from '../utilities';

export default function functionFromPath(functionPath) {
  return FunctionType({
    name: functionPath.get('id.name').node,
    params: functionPath.get('params').map(paramFromPath),
    location: locationFromPath(functionPath),
  });
}
