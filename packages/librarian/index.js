import fs from 'fs';
import {join} from 'path';
import glob from 'glob';
import shell from 'shelljs';
import loadConfig from './config';
import register from './register';

(async () => {
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

  const symbols = files.reduce((allSymbols, file) => [...allSymbols, ...processFile(file)], []);

  const out = config.absolutePath(config.output);
  shell.mkdir('-p', out);
  fs.writeFileSync(join(out, 'dump.json'), JSON.stringify(symbols, null, 2));
})().catch((e) => console.log(e.stack));

function getFiles(files) {
  return files.reduce((allFiles, pattern) => [...allFiles, ...glob.sync(pattern)], []);
}

// const symbols = [];
// [
//   join(__dirname, '../example/my-func.js'),
//   join(__dirname, '../example/my-class.js'),
// ].forEach((file) => symbols.push(...processFile(file)));
//
// const outDir = join(__dirname, '../output/librarian');
// shell.mkdir('-p', outDir);
// fs.writeFileSync(join(outDir, 'dump.json'), JSON.stringify(symbols, null, 2));
//
// function processFile(file) {
//   const matchingLanguage = Object
//     .values(languages)
//     .find((language) => (
//       language.matches.some((match) => match.test(file))
//     ));
//
//   return matchingLanguage.processor(file);
// }
