import { FormatIcu } from '@tolgee/format-icu';
import { DevTools, Tolgee } from '@tolgee/web';

const apiKey = process.env.NEXT_PUBLIC_TOLGEE_API_KEY;
const apiUrl = process.env.NEXT_PUBLIC_TOLGEE_API_URL;

export const ALL_LOCALES = ['en', 'cs', 'de', 'fr'];

export const DEFAULT_LOCALE = 'en';

export async function getStaticData(languages: string[]) {
  const result: Record<string, any> = {};
  for (const lang of languages) {
    result[lang] = (await import(`../i18n/${lang}.json`)).default;
  }
  return result;
}

export function TolgeeBase() {
  return Tolgee().use(FormatIcu()).use(DevTools()).updateDefaults({
    apiKey,
    apiUrl,
    fallbackLanguage: 'en',
  });
}
