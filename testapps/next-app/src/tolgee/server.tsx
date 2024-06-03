import { getLocale } from 'next-intl/server';

import { TolgeeBase, ALL_LOCALES, getStaticData } from './shared';
import { createServerInstance } from '@tolgee/react/server';

export const { getTolgee, getTranslate, T } = createServerInstance({
  getLocale: getLocale,
  createTolgee: async (locale) =>
    TolgeeBase().init({
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
