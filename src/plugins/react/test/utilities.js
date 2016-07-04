import {getLibrary} from '../../../test-utilities';
import createPlugin from '..';

export async function getLibraryFromFiles(files, options) {
  return await getLibrary({
    files,
    config: {plugins: [createPlugin(options)]},
  });
}

export async function getLibraryFromSource(source, options) {
  return await getLibraryFromFiles([{source, filename: 'example.js'}], options);
}

export async function getFirstMatch({source, type, ...options}) {
  const library = await getLibraryFromSource(source, options);
  return library.find((entity) => type.check(entity));
}
