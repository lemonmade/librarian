import traverse from 'babel-traverse';

import Builder from '../';
import parse from '../../parse';
import tags from '../../tags';

export function allEntities(source) {
  const entities = [];

  traverseSource(source, {
    Program(path, state) {
      path.get('body').forEach((bodyPath) => {
        const entity = state.builder.get(bodyPath, state);
        if (entity) { entities.push(entity); }
      });
    },
  });

  return entities;
}

export function firstEntity(source) {
  return buildPath(source);
}

export function buildPath(source, selector = '') {
  let entity;

  traverseSource(source, {
    Program(path, state) {
      entity = state.builder.get(
        path.get(`body.0${selector && '.'}${selector}`),
        state
      );
    },
  });

  return entity;
}

function traverseSource(source, handler) {
  traverse(parse(source), handler, null, {filename: 'test.js', tags, builder: new Builder()});
}
