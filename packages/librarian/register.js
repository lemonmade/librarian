export default function register({plugins}) {
  const languages = {};
  let viewer = {};

  function registrar(name, configer) {
    const language = {
      matches: [],
    };

    configer({
      viewer(pluginViewer) {
        viewer = {...viewer, ...pluginViewer};
      },
      processor(processor) {
        language.processor = processor;
      },
      matches(...matchers) {
        language.matches.push(...matchers);
      },
    });

    languages[name] = language;
  }

  plugins.forEach((plugin) => plugin(registrar));
  return {viewer, languages};
}
