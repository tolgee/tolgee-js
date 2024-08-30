import { getServerLocales } from '../tolgee';

export const data = async (pageContext) => {
  const { lang } = pageContext;

  const locales = await getServerLocales(lang);
  return locales;
};
