function noop() {}

const basePlugin = {setup: noop};

const NAME = Symbol('pluginName');

export default function plugin(name, pluginConfig) {
  function createPlugin(opts = {}) {
    const result = pluginConfig(opts) || {};
    Object.setPrototypeOf(result, basePlugin);
    result[NAME] = name;
    return result;
  }

  createPlugin.createdPlugin = (instance) => instance[NAME] === name;

  return createPlugin;
}
