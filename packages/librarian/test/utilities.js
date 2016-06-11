import createLibrary from '../src/library';

export function getLibrary({source, processor, filename}) {
  const library = createLibrary();
  const config = {logger() {}};
  library.add(...processor({source, filename}, {config}));
  library.organize();
  return library;
}
