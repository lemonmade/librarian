import shell from 'shelljs';

import createLibrary from './library';
import {loadBasicConfig} from './config';

export async function getLibrary({files, config: basicConfig}) {
  const config = loadBasicConfig({root: process.cwd(), silent: true, ...basicConfig});
  const {library: descriptor} = config;
  const library = createLibrary({descriptor});
  const filenames = files.map((file) => file.filename);

  config.getSource = (filename) => files.find((file) => file.filename === filename).source;

  for (const {filename} of files) {
    shell.touch(filename);
  }

  for (const processor of config.plugins.processors) {
    const newEntities = await processor.process(filenames.filter(processor.shouldProcess.bind(processor)), config);
    library.add(...(Array.isArray(newEntities) ? newEntities : [newEntities]));
  }

  library.organize();
  return library;
}
