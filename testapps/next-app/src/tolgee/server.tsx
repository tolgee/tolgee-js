import { TolgeeBase, ALL_LOCALES, getStaticData } from './shared';
import { createServerInstance } from '@tolgee/react/server';
import { getLocale } from './locale';

export const { getTolgee, getTranslate, T } = createServerInstance({
  getLocale,
  createTolgee: async (locale) =>
    TolgeeBase().init({
      // including all locales
      // on server we are not concerned about bundle size
      staticData: await getStaticData(ALL_LOCALES),
      observerOptions: {
        fullKeyEncode: true,
      },
      language: locale,
      fetch: async (input, init) => {
        const data = await fetch(input, { ...init, next: { revalidate: 0 } });
        return data;
      },
    }),
});
