import { getServerLocales } from '../tolgee';

export const data = async () => {
  const locales = await getServerLocales('en');
  return locales;
};
