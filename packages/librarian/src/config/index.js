import path from 'path';
import cosmiconfig from 'cosmiconfig';

import {Descriptor} from '../library';
import Processor from './processor';
import Renderer from './renderer';
import createLogger from './logger';

const BASE_CONFIG = {
  root: process.cwd(),
  source: ['src'],
  output: 'docs',
  plugins: [],

  processor: new Processor(),
  library: new Descriptor(),
  renderer: new Renderer(),
  logger: createLogger(),

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
  return initialize(BASE_CONFIG.augmentWith(config));
}

function initialize(config) {
  const {plugins} = config;
  plugins.forEach((plugin) => plugin(config));
  return config;
}
