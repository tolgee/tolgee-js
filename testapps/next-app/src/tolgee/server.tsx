import { TolgeeBase, ALL_LANGUAGES, getStaticData } from './shared';
import { createServerInstance } from '@tolgee/react/server';
import { getLanguage } from './language';

export const { getTolgee, getTranslate, T } = createServerInstance({
  getLocale: getLanguage,
  createTolgee: async (locale) =>
    TolgeeBase().init({
      // including all locales
      // on server we are not concerned about bundle size
      staticData: await getStaticData(ALL_LANGUAGES),
      observerOptions: {
        fullKeyEncode: true,
      },
      language: locale,
      fetch: async (input, init) =>
        fetch(input, { ...init, next: { revalidate: 0 } }),
    }),
});
