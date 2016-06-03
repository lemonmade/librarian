import fs from 'fs';
import {join} from 'path';
import glob from 'glob';
import shell from 'shelljs';
import loadConfig from './config';
import Library from './library';

export async function load() {
  const config = await loadConfig();
  const outFile = join(config.absolutePath(config.output), 'dump.json');
  const data = JSON.parse(fs.readFileSync(outFile, 'utf8'));
  return new Library(data);
}

export async function run() {
  const config = await loadConfig();
  const library = new Library();
  const {source, output, processor, renderer} = config;
  const files = getFiles(source);

  await Promise.all(files.map(async (file) => {
    const entities = await processor.process(file, {config}) || [];
    library.add(entities);
    return entities;
  }));

  const out = config.absolutePath(output);
  shell.mkdir('-p', out);
  fs.writeFileSync(join(out, 'dump.json'), library.toJSON(null, 2));

  await renderer.render(library, config);
}

function getFiles(files) {
  return files.reduce((allFiles, pattern) => [...allFiles, ...glob.sync(pattern)], []);
}
