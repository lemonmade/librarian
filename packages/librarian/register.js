export default function register({plugins}) {
  const languages = {};
  let library = {};

  function registrar(name, configer) {
    const language = {
      matches: [],
    };

    configer({
      library(pluginLibrary) {
        library = {...library, ...pluginLibrary};
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
  return {library, languages};
}
