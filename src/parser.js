import path from 'path';

export default function({plugins = []} = {}) {
  verifyPlugins(plugins);

  function runPluginsOnFile(file) {
    const testOptions = {
      extension: path.extname(file).replace(/^\./, ''),
    };

    return plugins
      .filter((plugin) => plugin.test(file, testOptions))
      .reduce((results, plugin) => ({...results, ...plugin.parse(file)}), {});
  }

  return function parse(files) {
    return files.reduce((results, file) => {
      results[file] = runPluginsOnFile(file);
      return results;
    }, {});
  };
}

function verifyPlugins(plugins) {
  plugins.forEach((plugin) => {
    if (typeof plugin.test !== 'function') {
      throw new Error(`Plugin '${plugin.name}' should have a test method.`);
    }
  });
}
