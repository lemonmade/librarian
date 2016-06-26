export default class Plugins {
  constructor(plugins = []) {
    this.plugins = plugins;
  }

  add(plugin) {
    plugin.setup(this.config);
    this.plugins.push(plugin);
  }

  findOrAdd(pluginInitializer, options = {}) {
    let plugin = this.find((aPlugin) => pluginInitializer.createdPlugin(aPlugin));

    if (plugin == null) {
      plugin = pluginInitializer(options);
      this.add(plugin);
    }

    return plugin;
  }

  get renderers() {
    return this.filter((plugin) => typeof plugin.render === 'function');
  }

  get processors() {
    return this.filter((plugin) => typeof plugin.process === 'function');
  }

  find(predicate) {
    return this.plugins.find(predicate);
  }

  filter(predicate) {
    return this.plugins.filter(predicate);
  }
}
