import fs from 'fs';
import path from 'path';
import {renderFile} from 'ejs';

export default function staticSiteGenerator({template, output = 'out.html'} = {}) {
  async function renderStaticSite(library, config) {
    config.logger('Rendering static site', {plugin: 'static-site-generator'});

    const result = await new Promise((resolve, reject) => {
      renderFile(template, {library}, (error, result) => {
        if (error) { return reject(error); }
        return resolve(result);
      });
    });

    fs.writeFileSync(
      config.absolutePath(path.join(config.output, output)),
      result
    );
  }

  return function setup({renderer}) {
    renderer.add(renderStaticSite);
  };
}
