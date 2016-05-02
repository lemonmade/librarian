export default function register({plugins}) {
  let viewer = {};

  const configurator = {
    viewer(pluginViewer) {
      viewer = {...viewer, ...pluginViewer};
    },
  };

  function registrar(language, configer) {
    configer(configurator);
  }

  plugins.forEach((plugin) => plugin(registrar));
  return viewer;
}
