'use server';

import { detectLanguageFromHeaders } from '@tolgee/react/server';
import { cookies, headers } from 'next/headers';
import { ALL_LANGUAGES, DEFAULT_LANGUAGE } from './shared';

const LANGUAGE_COOKIE = 'NEXT_LANGUAGE';

export async function setLanguage(locale: string) {
  const cookieStore = cookies();
  cookieStore.set({
    name: LANGUAGE_COOKIE,
    value: locale,
  });
}

export async function getLanguage() {
  const cookieStore = cookies();
  const locale = cookieStore.get(LANGUAGE_COOKIE)?.value;
  if (locale && ALL_LANGUAGES.includes(locale)) {
    return locale;
  }

  // try to detect language from headers
  const detected = detectLanguageFromHeaders(headers(), ALL_LANGUAGES);
  // or use default
  return detected || DEFAULT_LANGUAGE;
}
