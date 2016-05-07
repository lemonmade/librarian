import fs from 'fs';
import {join} from 'path';
import shell from 'shelljs';
import register from './register';
import javascript from './plugins/javascript';

const {languages} = register({plugins: [javascript]});

const symbols = [];
[
  join(__dirname, '../example/my-func.js'),
  join(__dirname, '../example/my-class.js'),
].forEach((file) => symbols.push(...processFile(file)));

const outDir = join(__dirname, '../output/librarian');
shell.mkdir('-p', outDir);
fs.writeFileSync(join(outDir, 'dump.json'), JSON.stringify(symbols, null, 2));

function processFile(file) {
  const matchingLanguage = Object
    .values(languages)
    .find((language) => (
      language.matches.some((match) => match.test(file))
    ));

  return matchingLanguage.processor(file);
}
