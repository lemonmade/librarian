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
  const {source, output, library: descriptor} = config;
  const library = new Library({descriptor});
  const files = getFiles(source);

  await Promise.all(files.map(async (filename) => {
    const entities = await processFile(filename, config);
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
  await render(library, config);
}

async function render(library, config) {
  const {renderers} = config.plugins;

  return await Promise.all(
    renderers.map((renderer) => renderer.render(library, config))
  );
}

async function processFile(filename, config) {
  const source = await new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (error, contents) => {
      if (error) { return reject(error); }
      return resolve(contents);
    });
  });

  const details = {filename, source};
  const processors = config.plugins.processors.filter((plugin) => plugin.shouldProcess(details));

  const allEntities = [];
  for (const processor of processors) {
    const newEntities = await processor.process(details, config);
    allEntities.push(...newEntities);
  }

  return allEntities;
}

function getFiles(files) {
  return files.reduce((allFiles, pattern) => [...allFiles, ...glob.sync(pattern)], []);
}
