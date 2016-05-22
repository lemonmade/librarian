import fs from 'fs';
import {join} from 'path';
import glob from 'glob';
import shell from 'shelljs';
import loadConfig from './config';
import register from './register';
import Library from './library';

export async function load() {
  const config = await loadConfig();
  const outFile = join(config.absolutePath(config.output), 'dump.json');
  const data = JSON.parse(fs.readFileSync(outFile, 'utf8'));
  return new Library(data);
}

export async function run() {
  const config = await loadConfig();
  const {languages} = register(config);
  const files = getFiles(config.source);

  function processFile(file) {
    const matchingLanguage = Object
      .values(languages)
      .find((language) => (
        language.matches.some((match) => match.test(file))
      ));

    return matchingLanguage.processor(file);
  }

  const library = new Library(files.reduce((allSymbols, file) => [...allSymbols, ...processFile(file)], []));

  const out = config.absolutePath(config.output);
  shell.mkdir('-p', out);
  fs.writeFileSync(join(out, 'dump.json'), library.toJSON(null, 2));

  const options = {library, config};
  for (const processor of config.processors) {
    await processor(options);
  }
}

function getFiles(files) {
  return files.reduce((allFiles, pattern) => [...allFiles, ...glob.sync(pattern)], []);
}
