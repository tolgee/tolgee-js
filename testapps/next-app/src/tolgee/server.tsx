import { getLanguage } from './language';
import { TolgeeBase } from './shared';
import { createServerInstance } from '@tolgee/react/server';

export const { getTolgee, getTranslate, T, getTolgeeStaticInstance } =
  createServerInstance({
    getLocale: getLanguage,
    createTolgee: async (language) => {
      const tolgee = TolgeeBase().init({
        observerOptions: {
          fullKeyEncode: true,
        },
        language,
      });
      await tolgee.loadRequired();
      return tolgee;
    },
  });
