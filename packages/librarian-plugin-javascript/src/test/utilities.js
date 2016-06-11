import {getLibrary} from 'librarian/test/utilities';
import processJS from '../processor';

export function getLibraryFromSource(source, options) {
  return getLibrary({
    source,
    processor: processJS,
    filename: 'example.js',
    ...options,
  });
}

export function getFirstMatch({source, type, ...options}) {
  return getLibraryFromSource(source, options).find((entity) => type.check(entity));
}
