import paramFromPath from './param';

export default function functionFromPath(functionPath) {
  return {
    name: functionPath.get('id.name').node,
    params: functionPath.get('params').map(paramFromPath),
  };
}
