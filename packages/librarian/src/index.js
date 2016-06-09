import fs from 'fs';
import {join} from 'path';
import glob from 'glob';
import shell from 'shelljs';
import loadConfig from './config';
import Library from './library';

export async function load() {
  const config = await loadConfig();
  const outFile = join(config.absolutePath(config.output), 'dump.json');
  return Library.deserialize(fs.readFileSync(outFile));
}

export async function run() {
  const config = await loadConfig();
  const library = new Library();
  const {source, output, processor, renderer} = config;
  const files = getFiles(source);

  await Promise.all(files.map(async (filename) => {
    const entities = await processor.process(filename, {config});
    library.add(...entities);
    return entities;
  }));

  const out = config.absolutePath(output);
  shell.mkdir('-p', out);
  await new Promise((resolve, reject) => {
    fs.writeFile(join(out, 'dump.json'), library.serialize({pretty: true}), (error, value) => {
      if (error) { return reject(error); }
      return resolve(value);
    });
  });

  library.organize();
  await renderer.render(library, config);
}

function getFiles(files) {
  return files.reduce((allFiles, pattern) => [...allFiles, ...glob.sync(pattern)], []);
}
