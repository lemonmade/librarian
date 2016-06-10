import {matches} from 'lodash';

import {isID} from '../id';
import {isEntity} from '../entities';
import {isProxy} from '../proxy';

export {default as Descriptor} from './descriptor';

export default class Library {
  static deserialize(str) {
    const {data} = JSON.parse(str.toString());
    const library = new Library(data);
    library.organize();
    return library;
  }

  isOrganized = false;

  constructor({entities = [], descriptor} = {}) {
    this.entities = new Set(entities);

    if (descriptor) {
      matchLibraryToDescriptor(this, descriptor);
    }
  }

  add(...entities) {
    for (const entity of entities) {
      if (isProxy(entity)) { continue; }
      this.entities.add(entity);
    }
  }

  has(...entities) {
    return entities.every((entity) => this.entities.has(entity));
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
    if (this.isOrganized) { return; }

    this.isOrganized = true;
    const {entities} = this;

    const findID = (anID) => {
      const findResult = this.find(({id}) => anID.equals(id));
      // Crazy hack. Right now, member expression IDs point to the member itself,
      // not the value. Need to clean this shit up.
      return findResult && findResult.value ? findResult.value : findResult;
    };

    const pulled = new Set();

    // eslint-disable-next-line func-style
    const pullEntitiesToTopLevel = (obj) => {
      if (pulled.has(obj)) { return; }
      pulled.add(obj);

      if (isEntity(obj)) {
        this.add(obj);
      }

      Object
        .values(obj)
        .filter((value) => value != null && typeof value === 'object' && !isID(value))
        .forEach((value) => {
          if (Array.isArray(value)) {
            value.forEach(pullEntitiesToTopLevel);
          } else {
            pullEntitiesToTopLevel(value);
          }
        });
    };

    entities.forEach(pullEntitiesToTopLevel);

    const reconstructed = new Set();
    function reconstructObject(obj) {
      if (!obj || reconstructed.has(obj)) { return obj; }
      reconstructed.add(obj);

      if (isEntity(obj)) {
        Object.defineProperty(obj, 'id', {
          value: obj.id.resolved,
        });
      }

      for (const [name, value] of Object.entries(obj)) {
        if (name === 'id') { break; }

        if (Array.isArray(value)) {
          obj[name] = value.map(reconstructObject);
        } else if (isID(value)) {
          obj[name] = findID(value);
        } else if (isProxy(value)) {
          obj[name] = findID(value.id);
        } else if (typeof value === 'object') {
          obj[name] = reconstructObject(value);
        }
      }

      return isID(obj) ? findID(obj) : obj;
    }

    entities.forEach(reconstructObject);
    console.log(entities);
  }

  serialize({pretty = false} = {}) {
    return JSON.stringify({data: deconstructLibrary(this)}, null, pretty ? 2 : 0);
  }
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
    } else if (isID(obj)) {
      return obj.resolved;
    } else if (Array.isArray(obj)) {
      return obj.map(deconstructValue);
    } else if (isEntity(obj)) {
      return obj.id;
    } else {
      return deconstructObject(obj);
    }
  }

  return [...library.entities].map(deconstructObject);
}

function matchLibraryToDescriptor(library, descriptor) {
  assignNamespaceDescriptionToObject({
    library,
    object: library,
    namespace: descriptor.rootNamespace,
  });
}

function assignNamespaceDescriptionToObject({namespace, library, object = {}}) {
  for (const subNamespace of namespace.eachNamespace()) {
    object[subNamespace.name] = assignNamespaceDescriptionToObject({namespace: subNamespace, library});
  }

  for (const entity of namespace.eachEntity()) {
    Object.defineProperty(object, entity.name, {
      get: () => library.findAll((val) => entity.type.check(val)),
    });
  }

  return object;
}
