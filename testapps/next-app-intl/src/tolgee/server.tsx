import { getLocale } from 'next-intl/server';
import { createServerInstance } from '@tolgee/react/server';
import { TolgeeBase } from './shared';

export const { getTolgee, getTranslate, T } = createServerInstance({
  getLocale: getLocale,
  createTolgee: async (language) => {
    return TolgeeBase().init({
      observerOptions: {
        fullKeyEncode: true,
      },
      language,
    });
  },
});
