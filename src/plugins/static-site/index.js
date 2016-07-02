import fs from 'fs';
import path from 'path';
import {renderFile} from 'ejs';

import plugin from '../../plugin';

export default plugin('Static site generator', ({template, output = 'out.html'}) => ({
  async render(library, config) {
    config.logger('Rendering static site', {plugin: 'static-site-generator'});

    const contents = await new Promise((resolve, reject) => {
      renderFile(template, {library}, (error, result) => {
        if (error) { return reject(error); }
        return resolve(result);
      });
    });

    fs.writeFileSync(
      config.absolutePath(path.join(config.output, output)),
      contents
    );
  },
}));
