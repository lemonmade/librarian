import path from 'path';
import cosmiconfig from 'cosmiconfig';

const BASE_CONFIG = {
  root: process.cwd(),
  source: ['src'],
  output: 'docs',
  plugins: [],

  absolutePath(thePath) {
    return path.isAbsolute(thePath) ? thePath : path.join(this.root, thePath);
  },

  rootRelative(thePath) {
    return path.relative(this.root, thePath);
  },

  augmentWith(config) {
    return Object.keys(config).reduce((fullConfig, key) => {
      if (config[key] != null) { fullConfig[key] = config[key]; }
      return fullConfig;
    }, {...this});
  },
};

export default async function loadConfig() {
  const {config} = await cosmiconfig('librarian', {rcExtensions: true}) || {};
  return BASE_CONFIG.augmentWith(config);
}
