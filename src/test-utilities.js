import shell from 'shelljs';

import createLibrary from './library';
import {loadBasicConfig} from './config';

export function getLibrary({files, config: basicConfig}) {
  const config = loadBasicConfig({root: process.cwd(), silent: true, ...basicConfig});
  const {library: descriptor} = config;
  const library = createLibrary({descriptor});

  for (const {filename} of files) {
    shell.touch(filename);
  }

  for (const {source, filename} of files) {
    library.add(...processFile({source, filename}, config));
  }

  library.organize();
  return library;
}

function processFile(details, config) {
  return config
    .plugins
    .processors
    .filter((plugin) => plugin.shouldProcess(details))
    .reduce((all, processor) => ([
      ...all,
      ...processor.process(details, config),
    ]), []);
}
