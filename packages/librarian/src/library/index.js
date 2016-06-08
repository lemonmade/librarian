import {matches} from 'lodash';

export {default as Descriptor} from './descriptor';

export default class Library {
  static deserialize(str) {
    const {data} = JSON.parse(str.toString());
    return new Library(reconstructLibrary(data));
  }

  constructor(entities = []) {
    this.entities = new Set(entities);
  }

  add(...entities) {
    for (const entity of entities) {
      this.entities.add(entity);
    }
  }

  find(predicate) {
    return this.findAll(predicate)[0];
  }

  findAll(predicate) {
    return this.filter(matches(predicate));
  }

  filter(predicate) {
    const allMatches = [];
    for (const entity of this.entities) {
      if (predicate(entity)) { allMatches.push(entity); }
    }
    return allMatches;
  }

  finalize() {
    this.entities = new Set(reconstructLibrary(this.entities));
  }

  serialize({pretty = false} = {}) {
    return JSON.stringify({data: deconstructLibrary(this.entities)}, null, pretty ? 2 : 0);
  }
}

function isID(value) {
  return typeof value === 'string' && value.indexOf('id:') === 0;
}

function isEntity(value) {
  return value != null && value.hasOwnProperty('__type');
}

let id = 1;
function uniqueID() {
  return `id:${id++}`;
}

function provideUniqueID(entity) {
  entity.id = uniqueID();
}

function deconstructLibrary(entities) {
  const finalEntities = new Set();

  for (const entity of entities) {
    for (const finalEntity of deconstructEntity(entity)) {
      finalEntities.add(finalEntity);
    }
  }

  return finalEntities;
}

function deconstructEntity(entity) {
  const entities = new Set();

  function checkObject(obj) {
    if (!obj || typeof obj !== 'object') { return obj; }

    obj = {...obj};

    if (isEntity(obj)) {
      entities.add(obj);
      provideUniqueID(obj);
    }

    for (const [name, value] of Object.entries(obj)) {
      if (Array.isArray(value)) {
        obj[name] = value.map(checkObject);
      } else if (typeof value === 'object') {
        obj[name] = checkObject(value);
      }
    }

    return isEntity(obj) ? obj.id : obj;
  }

  checkObject(entity);
  return entities;
}

function reconstructLibrary(entities) {
  const allEntities = [...entities];

  function findID(anID) {
    return allEntities.find((entity) => entity.id === anID);
  }

  function reconstructObject(obj) {
    if (!obj) { return obj; }

    for (const [name, value] of Object.entries(obj)) {
      if (Array.isArray(value)) {
        obj[name] = value.map(reconstructObject);
      } else if (value != null && typeof value === 'object') {
        obj[name] = reconstructObject(value);
      } else if (isID(value) && name !== 'id') {
        obj[name] = findID(value);
      }
    }

    return isID(obj) ? findID(obj) : obj;
  }

  // console.log(allEntities.map(reconstructObject));
  return allEntities.map(reconstructObject);
}
