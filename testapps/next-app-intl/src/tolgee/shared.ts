import { FormatIcu } from '@tolgee/format-icu';
import { DevTools, Tolgee } from '@tolgee/web';

const apiKey = process.env.NEXT_PUBLIC_TOLGEE_API_KEY;
const apiUrl = process.env.NEXT_PUBLIC_TOLGEE_API_URL;

export const ALL_LANGUAGES = ['en', 'cs', 'de', 'fr'];

export const DEFAULT_LANGUAGE = 'en';

export function TolgeeBase() {
  return Tolgee()
    .use(FormatIcu())
    .use(DevTools())
    .updateDefaults({
      apiKey,
      apiUrl,
      fallbackLanguage: 'en',
      staticData: {
        en: () => import('../../messages/en.json'),
        cs: () => import('../../messages/cs.json'),
        de: () => import('../../messages/de.json'),
        fr: () => import('../../messages/fr.json'),
      },
    });
}
