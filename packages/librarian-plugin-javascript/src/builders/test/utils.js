import traverse from 'babel-traverse';

import Builder from '../';
import parse from '../../parse';
import tags from '../../tags';

export function firstEntity(source) {
  return buildPath(source);
}

export function buildPath(source, selector = '') {
  let entity;
  const builder = new Builder();

  traverse(parse(source), {
    Program(path, ...args) {
      entity = builder.get(path.get(`body.0${selector && '.'}${selector}`), ...args);
    },
  }, null, {filename: 'test.js', tags, builder});

  return entity;
}
