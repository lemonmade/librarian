import {matches} from 'lodash';

export {default as Descriptor} from './descriptor';

export default class Library {
  static deserialize(str) {
    const {data} = JSON.parse(str.toString());
    const library = new Library(data);
    library.organize();
    return library;
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
    return this.filter(typeof predicate === 'object' ? matches(predicate) : predicate);
  }

  filter(predicate) {
    const allMatches = [];
    for (const entity of this.entities) {
      if (predicate(entity)) { allMatches.push(entity); }
    }
    return allMatches;
  }

  organize() {
    const {entities} = this;

    const findID = (anID) => this.find({id: anID});

    // eslint-disable-next-line func-style
    const pullEntitiesToTopLevel = (obj) => {
      if (isEntity(obj)) {
        provideUniqueID(obj);
        this.add(obj);
      }

      Object
        .values(obj)
        .filter((value) => value != null && typeof value === 'object')
        .forEach((value) => {
          if (Array.isArray(value)) {
            value.forEach(pullEntitiesToTopLevel);
          } else {
            pullEntitiesToTopLevel(value);
          }
        });
    };

    entities.forEach(pullEntitiesToTopLevel);

    function reconstructObject(obj) {
      if (!obj) { return obj; }

      for (const [name, value] of Object.entries(obj)) {
        if (Array.isArray(value)) {
          obj[name] = value.map(reconstructObject);
        } else if (typeof value === 'object') {
          obj[name] = reconstructObject(value);
        } else if (isID(value) && name !== 'id') {
          obj[name] = findID(value);
        }
      }

      return isID(obj) ? findID(obj) : obj;
    }

    entities.forEach(reconstructObject);
  }

  serialize({pretty = false} = {}) {
    return JSON.stringify({data: deconstructLibrary(this)}, null, pretty ? 2 : 0);
  }
}

function isID(value) {
  return typeof value === 'string' && value.indexOf('id:') === 0;
}

function isEntity(value) {
  return value != null && value.__type;
}

let id = 1;
function uniqueID() {
  return `id:${id++}`;
}

function provideUniqueID(entity) {
  entity.id = uniqueID();
}

function deconstructLibrary(library) {
  library.organize();

  function deconstructObject(obj) {
    return Object
      .entries(obj)
      .reduce((newObj, [name, value]) => ({...newObj, [name]: deconstructValue(value)}), {});
  }

  function deconstructValue(obj) {
    if (obj == null || typeof obj !== 'object') {
      return obj;
    } else if (Array.isArray(obj)) {
      return obj.map(deconstructValue);
    } else {
      const newObj = deconstructObject(obj);
      return isEntity(newObj) ? newObj.id : newObj;
    }
  }

  return [...library.entities].map(deconstructObject);
}
