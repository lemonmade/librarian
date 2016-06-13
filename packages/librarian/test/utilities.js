import shell from 'shelljs';

import createLibrary from '../src/library';
import {loadBasicConfig} from '../src/config';

export function getLibrary({files, config: basicConfig}) {
  shell.mkdir('temp');
  shell.cd('temp');

  const config = loadBasicConfig({root: process.cwd(), ...basicConfig});
  const {library: descriptor, processor} = config;
  const library = createLibrary({descriptor});

  for (const {filename} of files) {
    shell.touch(filename);
  }

  for (const {source, filename} of files) {
    library.add(...processor.process({source, filename}, {config}));
  }

  shell.cd('..');
  shell.rm('-rf', 'temp');

  library.organize();
  return library;
}
