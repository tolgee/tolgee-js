import { getLocale } from 'next-intl/server';

import { TolgeeBase, ALL_LANGUAGES, getStaticData } from './shared';
import { createServerInstance } from '@tolgee/react/server';

export const { getTolgee, getTranslate, T } = createServerInstance({
  getLocale: getLocale,
  createTolgee: async (language) =>
    TolgeeBase().init({
      // including all languages
      // on server we are not concerned about bundle size
      staticData: await getStaticData(ALL_LANGUAGES),
      observerOptions: {
        fullKeyEncode: true,
      },
      language,
      fetch: async (input, init) =>
        fetch(input, { ...init, next: { revalidate: 0 } }),
    }),
});
