export const onBeforeRoute = (pageContext) => {
  const { lang: langParam } = pageContext.urlParsed.search;
  const supportedLangs = ['en', 'de', 'fr', 'cs'];
  const defaultLang = 'en';
  const browserLang = navigator.language.split('-')[0];

  let selectedLang;

  if (langParam && supportedLangs.includes(langParam)) {
    selectedLang = langParam;
  } else if (supportedLangs.includes(browserLang)) {
    selectedLang = browserLang;
  } else {
    selectedLang = defaultLang;
  }

  return {
    pageContext: {
      lang: selectedLang,
    },
  };
};
