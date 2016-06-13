import {getLibrary} from 'librarian/test/utilities';
import createPlugin from '..';

export function getLibraryFromFiles(files, options) {
  return getLibrary({
    files,
    config: {plugins: [createPlugin(options)]},
  });
}

export function getLibraryFromSource(source, options) {
  return getLibraryFromFiles([{source, filename: 'example.js'}], options);
}

export function getFirstMatch({source, type, ...options}) {
  return getLibraryFromSource(source, options).find((entity) => type.check(entity));
}
